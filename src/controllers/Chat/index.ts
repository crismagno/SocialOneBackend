import Chat from "../../models/Chat/index";
import Message from "../../models/Message/index";
import { Request, Response } from "express";
import { IChatCreate, IChatMessageCreateStart } from "./types";
import { IChatSchema } from "../../models/Chat/types";
import { IMessageSchema } from "../../models/Message/types";
import User from "../../models/User";
import { IUserSchema } from "../../models/User/types";
import { Types } from "mongoose";
import GlobalSocket from "../../helpers/socket";

class ChatController {

  public create = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { creator, person } = req.body;

      // validation request body
      if (!creator || !person) {
        return res.status(400).json({ message: "Error body request invalid" });
      };

      // verify if chat with only two users already exist
      const chatWithThisCreatorAndPersonExist: IChatSchema | null = await Chat.findOne({
        $or: [
          { users: [creator, person] },
          { users: [person, creator] },
        ]
      });

      // verify if chat with only two users already exist
      if (chatWithThisCreatorAndPersonExist) {
        return res.status(201).json({ message: "Error chat with user already exist" });
      };

      // object chat to create
      const chatCreate: IChatCreate = {
        users: [creator, person],
        admin: [creator],
        creator,
      };

      // create chat
      const chatCreated: IChatSchema = await Chat.create(chatCreate);

      // object message to create
      const messageCreate: IChatMessageCreateStart = {
        chat: chatCreated._id,
        userSent: creator,
        value: "Chat message start on SocialOne",
        startChat: true,
        type: "text",
        seenUsers: [creator],
        delivery: "send"
      };

      // create message start by chat
      const messageCreated: IMessageSchema = await Message.create(messageCreate);

      // update last message on chat
      const chatUpdateMessageStart: IChatSchema | null = await Chat.findByIdAndUpdate({
        _id: chatCreated?._id
      }, {
        $set: {
          lastMessage: messageCreated?._id
        }
      }, { 
        new: true 
      })
      .populate([
        { 
          path: "users", 
          model: "User", 
          select: {
            fullName: 1, 
            email: 1, 
            phone: 1, 
            online: 1, 
            avatar: 1
          } 
        },
        { 
          path: "lastMessage", 
          model: "Message" 
        },
      ]);

      // verify if update message on chat was ok!
      if (!chatUpdateMessageStart)
        return res.status(400).json({ 
          message: "Error for update message chat"
        });

      res.status(200).json({ 
        message: "Chat success", 
        chat: chatUpdateMessageStart 
      });
      
      // send new chat created to creator and person
      GlobalSocket.createChat(creator, person, chatUpdateMessageStart);
      
      console.log(`Chat created with success by 
        [creator: ${creator}]
        [person: ${person}]
      `);

      return;
    } catch (error) {
      console.log(`Chat created with error by 
        [creator: ${req.body.creator}]
        [person: ${req.body.person}]
      `, error);
      return res.status(400).json({ 
        message: "Error for create chat" 
      });
    }
  };

  public getChatsByUser = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      let { userId, skip, limit, searchValue } = req.body;
      let queryChats = {};

      if (!userId) {
        return res.status(400).json({ message: "Error body request invalid" });
      };

      userId = Types.ObjectId(userId);

      const searchValueRegex: any = new RegExp(searchValue, "ig"); 
      let usersBySearchValue: IUserSchema[] | null = null;

      // searvalue empty
      if (!searchValue?.trim()) {
        queryChats = {
          users: userId
        };
      };
      
      if (searchValue?.trim()) {

        usersBySearchValue = await User
          .distinct("_id", {
            $or: [ 
                { fullName: searchValueRegex }, 
                { email: searchValueRegex } 
              ],
            active: true
          });

        if (usersBySearchValue == null) {
          return res.status(400).json({ message: "Error to find users by search value, not found" });
        };

        const idsUsersSearchValue = usersBySearchValue
          .map((user: IUserSchema): Types.ObjectId => Types.ObjectId(user._id));

        if (idsUsersSearchValue.length > 0) {
          queryChats = {
            $and: [
              { users: userId },
              { users: { $in: idsUsersSearchValue } }
            ]
          };
        } else {
          queryChats = {
            users: []
          };
        };
      };

      const chats: IChatSchema[] | null = await Chat
        .find(queryChats)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort({ updatedAt: -1 })
        .populate([
          { 
            path: "users", 
            model: "User", 
            select: {
              fullName: 1, 
              email: 1, 
              phone: 1, 
              online: 1, 
              avatar: 1,
              active: 1
            }
          },
          { 
            path: "lastMessage", 
            model: "Message" 
          },
        ]);

      if (chats == null) {
        return res.status(400).json({ message: "Error to find chats not found" });
      };

      return res.status(200).json({ message: "Chats find with success!", chats });
    } catch(error) {
      console.log(`Error to getChatsByUser: [userId: ${req.body.userId}]`, error);
      return res.status(400).json({ message: "Error to getChatsByUser" });
    }
  };

  public getChatById = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      let { userId, chatId } = req.body;

      if (!userId || !chatId)
        return res.status(400).json({ message: "Error body request invalid" });

      userId = Types.ObjectId(userId);
      chatId = Types.ObjectId(chatId);

      const userDB = await User.distinct("_id", {
        _id: userId
      });
      
      // validate if user that call this chat exists
      if (!userDB) 
        return res.status(400).json({ message: "User don't exists" });

      const chat: IChatSchema | null = await Chat
        .findById(chatId)
        .populate([
          { 
            path: "users", 
            model: "User", 
            select: {
              fullName: 1, 
              email: 1, 
              phone: 1, 
              online: 1, 
              avatar: 1,
              active: 1
            }
          },
          { 
            path: "lastMessage", 
            model: "Message" 
          },
        ]);

      if (!chat) {
        return res.status(400).json({ message: "Error to find chat not found" });
      };

      return res.status(200).json({ message: "Chat find with success!", chat });
    } catch(error) {
      console.log(`Error to getChatById: 
        [userId: ${req.body.userId}]
        [chatId: ${req.body.chatId}]`, 
        error
      );
      return res.status(400).json({ message: "Error to get chat by id" });
    }
  };

};

export default new ChatController();
