const socket = require("socket.io");
import { Socket } from "socket.io";
import {
  IInformUserLogout,
  IInformUserOnline,
  ISetIdUserOnSeenMessages,
  ISetSeenOnMessageChat,
  IUserMakingActionOnChat,
} from "./types";
import UserController from "../../controllers/User";
import { IUser } from "../../models/User/types";
import ChatController from "../../controllers/Chat/index";
import { IMessageSchema } from "../../models/Message/types";

export default class GlobalSocket {
  public static io: Socket;
  /**
   * Method that start the socket of app
   * @param server
   */
  public static start = (server: any) => {
    try {
      GlobalSocket.io = socket(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      });

      GlobalSocket.io.on("connection", (socket: any) => {
        // informa o usuário online
        socket.on(`inform-user-online`, (data: IInformUserOnline): void => {
          // update property database user
          UserController.connectUserUpdateOnlineAndSocketId(
            data.userId,
            data.socketId
          );

          // emit to client that user is online
          GlobalSocket.io
            .compress(true)
            .emit(`inform-user-is-online`, data.userId);
        });

        // inform that user is typing
        socket.on(
          "user-is-making-action-on-chat",
          (data: IUserMakingActionOnChat) => {
            GlobalSocket.userIsMakingActionOnChat(data);
          }
        );

        // atualizar o seen da mensagem setando o usuario
        socket.on("set-seen-on-message-chat", (data: ISetSeenOnMessageChat) => {
          ChatController.setIdUserOnSeenMessageSingle(data);
        });

        // when sockets disconnect
        socket.on("disconnect", async () => {
          const userDisconnected =
            await UserController.disconnectUserUpdateBySocketId(socket.id);
          // verify if user was updated and found
          if (userDisconnected && userDisconnected?.socketId?.length === 0) {
            GlobalSocket.informUserOffLine(userDisconnected._id);
          }
        });
      });
      console.log(`Socket running with success...`);
    } catch (error) {
      console.error(`Socket is with error: `, error);
    }
  };

  /**
   * socket that identify tha creation of new chat
   * @param creator {String}
   * @param person {string}
   * @param chatCreated {any}
   */
  public static createChat(creator: string, person: string, chatCreated: any) {
    // user that create chat
    GlobalSocket.io
      .compress(true)
      .emit(`create-chat-send-to-creator-${creator}`, chatCreated);

    // user that was solicited chat
    GlobalSocket.io
      .compress(true)
      .emit(`create-chat-send-to-person-${person}`, chatCreated);
  }

  /**
   * Socket that infor user offline
   * @param userId
   */
  public static informUserOffLine = (userId: string) => {
    // emit to client that user is online
    GlobalSocket.io.compress(true).emit(`inform-user-is-offline`, userId);
  };

  /**
   * Socket that infor user alter avatar
   * @param data
   */
  public static informUserAlterAvatar = (data: {
    userId: string;
    avatar: string;
  }) => {
    // emit to client that user is online
    GlobalSocket.io.compress(true).emit(`inform-user-alter-avatar`, data);
  };

  /**
   * Socket that inform user update profile info
   * @param data
   */
  public static userUpdateProfileInfo = (data: {
    userId: string;
    property: keyof IUser;
    newValue: string;
  }) => {
    // emit to client that user is online
    GlobalSocket.io
      .compress(true)
      .emit(`inform-user-update-profile-info`, data);
  };

  /**
   * Socket that send message created by chat
   * @param data
   */
  public static messageCreatedBychatId = (data: {
    userId: string;
    chatId: string;
    messageCreated: IMessageSchema;
    message_id_temp: string;
  }) => {
    GlobalSocket.io
      .compress(true)
      .emit(`message-created-by-chat-id-home`, data);
  };

  /**
   * Socket that send messags updated
   * @param data
   */
  public static messagesUpdatedBychatId = (data: {
    userId: string;
    chatId: string;
    messages: IMessageSchema[];
  }) => {
    GlobalSocket.io
      .compress(true)
      .emit(`messages-updated-by-chat-id-home`, data);
  };

  /**
   * Socket that inform action of user on chat, with typing, or record audio or video
   * @param data
   */
  public static userIsMakingActionOnChat = (
    data: IUserMakingActionOnChat
  ): void => {
    GlobalSocket.io
      .compress(true)
      .emit(`user-is-making-action-on-chat-by-home`, data);
  };

  /**
   * Socket that inform update seen of messages of userId
   * @param data
   */
  public static setIdUserOnSeenMessages = (data: ISetIdUserOnSeenMessages) => {
    // dados que serap passados para o emit do socket
    const dataSendSocket = { ...data };
    delete dataSendSocket?.usersChat;

    // validar os usuarios do chat
    if (!data?.usersChat) return;

    // enviar socket somente aos usuarios do chat passado
    for (const userId of data?.usersChat) {
      GlobalSocket.io
        .compress(true)
        .emit(`set-seen-messages-by-home-${userId}`, dataSendSocket);
    }
  };
}
