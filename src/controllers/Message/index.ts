import Chat from "../../models/Chat/index";
import Message from "../../models/Message/index";
import { Request, Response } from "express";
import { IMessageSchema } from "../../models/Message/types";
import { Types } from "mongoose";
import GlobalSocket from "../../helpers/socket";
import { IMessageCreateSchema } from "./types";

class MessageController {
  public create = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      let { userId, chatId, message = null, message_id_temp } = req.body;

      if (!userId || !chatId || !message || !message_id_temp)
        return res.status(400).json({ message: "Error body request invalid" });

      userId = Types.ObjectId(userId);
      chatId = Types.ObjectId(chatId);

      const messageToCreate: IMessageCreateSchema = {
        chat: chatId,
        userSent: userId,
        value: message?.value,
        reply: message?.reply || null,
        type: message.type,
        seenUsers: [userId],
        delivery: "send",
      };

      const filterPropertiesUserOnPopulate = {
        fullName: 1,
        email: 1,
        phone: 1,
        online: 1,
        avatar: 1,
        active: 1,
      };

      const messageCreated: IMessageSchema = await (
        await Message.create(messageToCreate)
      ).populate([
        {
          path: "reply",
          model: "Message",
        },
        {
          path: "like",
          model: "User",
          select: filterPropertiesUserOnPopulate,
        },
      ]);

      if (!messageCreated)
        return res
          .status(400)
          .json({ message: "Error to find create message, not found" });

      // atualizar mensagem no chat
      await Chat.updateOne(
        {
          _id: chatId,
        },
        {
          $set: {
            lastMessage: messageCreated?._id,
          },
        }
      );

      res.status(200).json({
        message: "Messages find with success!",
        messageCreated,
        message_id_temp,
      });

      GlobalSocket.messageCreatedBychatId({
        userId,
        chatId,
        messageCreated,
        message_id_temp,
      });

      return;
    } catch (error) {
      console.log(
        `Error to create message: 
            [userId: ${req.body.userId}]
            [chatId: ${req.body.chatId}]`,
        error
      );
      return res.status(400).json({ message: "Error to create message" });
    }
  };

  public getMessagesByChatId = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      let { userId, chatId, limit = 20, skip = 0 } = req.body;

      if (!userId || !chatId)
        return res.status(400).json({ message: "Error body request invalid" });

      userId = Types.ObjectId(userId);
      chatId = Types.ObjectId(chatId);

      //   const userDB = await User.distinct("_id", {
      //     _id: userId
      //   });

      //   // validate if user that call this chat exists
      //   if (!userDB)
      //     return res.status(400).json({ message: "User don't exists" });

      const filterPropertiesUserOnPopulate = {
        fullName: 1,
        email: 1,
        phone: 1,
        online: 1,
        avatar: 1,
        active: 1,
      };

      const messages: IMessageSchema[] | null = await Message.find({
        chat: chatId,
      })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
        .populate([
          {
            path: "reply",
            model: "Message",
          },
          {
            path: "like",
            model: "User",
            select: filterPropertiesUserOnPopulate,
          },
        ]);

      if (!messages)
        return res
          .status(400)
          .json({ message: "Error to find messages not found" });

      return res
        .status(200)
        .json({ message: "Messages find with success!", messages });
    } catch (error) {
      console.log(
        `Error to getMessagesByChatId: 
        [userId: ${req.body.userId}]
        [chatId: ${req.body.chatId}]`,
        error
      );
      return res
        .status(400)
        .json({ message: "Error to get messages by chat id" });
    }
  };

  public getMessagesByChatIdAndDate = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      let { userId, chatId, lastMessageCreatedAt } = req.body;

      if (!userId || !chatId)
        return res.status(400).json({ message: "Error body request invalid" });

      userId = Types.ObjectId(userId);
      chatId = Types.ObjectId(chatId);

      const filterPropertiesUserOnPopulate = {
        fullName: 1,
        email: 1,
        phone: 1,
        online: 1,
        avatar: 1,
        active: 1,
      };

      const messages: IMessageSchema[] | null = await Message.find({
        chat: chatId,
        createdAt: {
          $gt: new Date(lastMessageCreatedAt),
        },
      })
        .sort({ createdAt: -1 })
        .populate([
          {
            path: "reply",
            model: "Message",
          },
          {
            path: "like",
            model: "User",
            select: filterPropertiesUserOnPopulate,
          },
        ]);

      if (!messages)
        return res
          .status(400)
          .json({ message: "Error to find messages not found" });

      return res
        .status(200)
        .json({ message: "Messages find with success!", messages });
    } catch (error) {
      console.log(
        `Error to getMessagesByChatIdAndDate: 
        [userId: ${req.body.userId}]
        [chatId: ${req.body.chatId}]`,
        error
      );
      return res
        .status(400)
        .json({ message: "Error to get messages by chat id and date" });
    }
  };

  public removeMessages = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      let {
        userId,
        chatId,
        messagesToRemove = [],
        removeToUsers = [],
      } = req.body;

      if (
        !userId ||
        !chatId ||
        (messagesToRemove && messagesToRemove?.length === 0) ||
        (removeToUsers && removeToUsers.length.length === 0)
      )
        return res.status(400).json({ message: "Error body request invalid" });

      userId = Types.ObjectId(userId);
      chatId = Types.ObjectId(chatId);
      messagesToRemove = messagesToRemove.map((_id: string) =>
        Types.ObjectId(_id)
      );

      // atualizar mensagens
      await Message.updateMany(
        {
          _id: { $in: messagesToRemove },
        },
        {
          $addToSet: {
            removeToUsers: removeToUsers,
          },
        }
      );

      const filterPropertiesUserOnPopulate = {
        fullName: 1,
        email: 1,
        phone: 1,
        online: 1,
        avatar: 1,
        active: 1,
      };

      // buscar mensagens atualizadas
      const messages: IMessageSchema[] = await Message.find({
        _id: { $in: messagesToRemove },
      })
        .sort({ createdAt: -1 })
        .populate([
          {
            path: "reply",
            model: "Message",
          },
          {
            path: "like",
            model: "User",
            select: filterPropertiesUserOnPopulate,
          },
        ]);

      if (!messages)
        return res
          .status(400)
          .json({ message: "Error to find messages not found" });

      res
        .status(200)
        .json({ message: "Messages find with success!", messages });

      GlobalSocket.messagesUpdatedBychatId({
        userId,
        chatId,
        messages
      });

      return;
    } catch (error) {
      console.log(
        `Error to removeMessages: 
        [userId: ${req.body.userId}]
        [chatId: ${req.body.chatId}]`,
        error
      );
      return res
        .status(400)
        .json({ message: "Error to remove messages by ids" });
    }
  };
}

export default new MessageController();
