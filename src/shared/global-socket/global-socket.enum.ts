namespace GlobalSocketEnum {
  export enum UrlsOn {
    CONNECTION = "connection",
    DISCONNECT = "disconnect",
    INFORM_USER_ONLINE = "inform-user-online",
    USER_IS_MAKING_ACTION_ON_CHAT = "user-is-making-action-on-chat",
    SET_SEEN_ON_MESSAGE_CHAT = "set-seen-on-message-chat",
  }

  export enum UrlsEmit {
    INFORM_USER_IS_ONLINE = "inform-user-is-online",
    CREATE_CHAT_SEND_TO_CREATOR = "create-chat-send-to-creator-",
    CREATE_CHAT_SEND_TO_PERSON = "create-chat-send-to-person-",
    INFORM_USER_IS_OFFLINE = "inform-user-is-offline",
    INFORM_USER_CHANGED = "inform-user-alter-avatar",
    INFORM_USER_UPDATED_PROFILE_INFO = "inform-user-update-profile-info",
    MESSAGE_CREATED_BY_CHAT_ID_HOME = "message-created-by-chat-id-home",
    MESSAGES_UPDATED_BY_CHAT_ID_HOME = "messages-updated-by-chat-id-home",
    USER_IS_MAKING_ACTION_ON_CHAT_BY_HOME = "user-is-making-action-on-chat-by-home",
    SET_SEEN_MESSAGES_BY_HOME = "set-seen-messages-by-home-",
  }

  export enum UserSendActionType {
    "TEXT" = "TEXT",
    "AUDIO" = "AUDIO",
    "VIDEO" = "VIDEO",
  }
}

export default GlobalSocketEnum;
