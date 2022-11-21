import GlobalSocketEnum from "../../shared/global-socket/global-socket.enum";
import { Schema } from "mongoose";

export interface IInformUserOnline {
  userId: string;
  socketId: string;
}

export interface IInformUserLogout {
  userId: string;
  socketId: string;
}

export interface IUserMakingActionOnChat {
  userId: string;
  socketId: string;
  chatId: string;
  isMakingAction: boolean;
  action: GlobalSocketEnum.UserSendActionType | null;
}

export interface ISetIdUserOnSeenMessages {
  userId: string;
  chatId: string;
  messagesIds: string[];
  usersChat?: string[];
}

export interface ISetSeenOnMessageChat {
  userId: Schema.Types.ObjectId;
  chatId: Schema.Types.ObjectId;
  messageId: Schema.Types.ObjectId;
  socketId: string;
}
