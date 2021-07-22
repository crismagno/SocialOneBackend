export interface IInformUserOnline {
    userId: string;
    socketId: string;
};

export interface IInformUserLogout {
    userId: string;
    socketId: string;
};

export interface IUserMakingActionOnChat {
    userId: string;
    socketId: string;
    chatId: string;
    isMakingAction: boolean;
    action: "text" | "audio" | "video" | "" | null
};