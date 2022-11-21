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
import GlobalSocketEnum from "../../shared/global-socket/global-socket.enum";
import Log from "../Log";
import { EModules } from "../Log/types";

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

      GlobalSocket.io.on(GlobalSocketEnum.UrlsOn.CONNECTION, (socket: any) => {
        // informa o usuário online
        socket.on(
          GlobalSocketEnum.UrlsOn.INFORM_USER_ONLINE,
          (data: IInformUserOnline): void => {
            // update property database user
            UserController.connectUserUpdateOnlineAndSocketId(
              data.userId,
              data.socketId
            );

            // emit to client that user is online
            GlobalSocket.io
              .compress(true)
              .emit(
                GlobalSocketEnum.UrlsEmit.INFORM_USER_IS_ONLINE,
                data.userId
              );
          }
        );

        // inform that user is typing
        socket.on(
          GlobalSocketEnum.UrlsOn.USER_IS_MAKING_ACTION_ON_CHAT,
          (data: IUserMakingActionOnChat) => {
            GlobalSocket.userIsMakingActionOnChat(data);
          }
        );

        // atualizar o seen da mensagem setando o usuario
        socket.on(
          GlobalSocketEnum.UrlsOn.SET_SEEN_ON_MESSAGE_CHAT,
          (data: ISetSeenOnMessageChat) => {
            ChatController.setIdUserOnSeenMessageSingle(data);
          }
        );

        // when sockets disconnect
        socket.on(GlobalSocketEnum.UrlsOn.DISCONNECT, async () => {
          const userDisconnected =
            await UserController.disconnectUserUpdateBySocketId(socket.id);

          // verify if user was updated and found
          if (userDisconnected && userDisconnected?.socketId?.length === 0) {
            GlobalSocket.informUserOffLine(userDisconnected._id);
          }
        });
      });

      Log.success({
        message: "Socket running with success...",
        module: EModules.GLOBAL_SOCKET,
      });
    } catch (error: any) {
      Log.error({
        message: `Socket is with error: ${error.message}`,
        module: EModules.GLOBAL_SOCKET,
      });
    }
  };

  public static createChat(creator: string, person: string, chatCreated: any) {
    // user that create chat
    GlobalSocket.io
      .compress(true)
      .emit(
        `${GlobalSocketEnum.UrlsEmit.CREATE_CHAT_SEND_TO_CREATOR}${creator}`,
        chatCreated
      );

    // user that was solicited chat
    GlobalSocket.io
      .compress(true)
      .emit(
        `${GlobalSocketEnum.UrlsEmit.CREATE_CHAT_SEND_TO_PERSON}${person}`,
        chatCreated
      );
  }

  public static informUserOffLine = (userId: string) => {
    GlobalSocket.io
      .compress(true)
      .emit(GlobalSocketEnum.UrlsEmit.INFORM_USER_IS_OFFLINE, userId);
  };

  public static informUserAlterAvatar = (data: {
    userId: string;
    avatar: string;
  }) => {
    GlobalSocket.io
      .compress(true)
      .emit(GlobalSocketEnum.UrlsEmit.INFORM_USER_CHANGED, data);
  };

  public static userUpdateProfileInfo = (data: {
    userId: string;
    property: keyof IUser;
    newValue: string;
  }) => {
    GlobalSocket.io
      .compress(true)
      .emit(GlobalSocketEnum.UrlsEmit.INFORM_USER_UPDATED_PROFILE_INFO, data);
  };

  public static messageCreatedBychatId = (data: {
    userId: string;
    chatId: string;
    messageCreated: IMessageSchema;
    message_id_temp: string;
  }) => {
    GlobalSocket.io
      .compress(true)
      .emit(GlobalSocketEnum.UrlsEmit.MESSAGE_CREATED_BY_CHAT_ID_HOME, data);
  };

  public static messagesUpdatedBychatId = (data: {
    userId: string;
    chatId: string;
    messages: IMessageSchema[];
  }) => {
    GlobalSocket.io
      .compress(true)
      .emit(GlobalSocketEnum.UrlsEmit.MESSAGES_UPDATED_BY_CHAT_ID_HOME, data);
  };

  public static userIsMakingActionOnChat = (
    data: IUserMakingActionOnChat
  ): void => {
    GlobalSocket.io
      .compress(true)
      .emit(
        GlobalSocketEnum.UrlsEmit.USER_IS_MAKING_ACTION_ON_CHAT_BY_HOME,
        data
      );
  };

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
        .emit(
          `${GlobalSocketEnum.UrlsEmit.SET_SEEN_MESSAGES_BY_HOME}${userId}`,
          dataSendSocket
        );
    }
  };
}
