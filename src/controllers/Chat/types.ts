import { Schema } from "mongoose";
import { TMessageDelivery, TMessageType } from "../../models/Message/types";

export interface IChatCreate {
    users: Schema.Types.ObjectId[];
    creator: Schema.Types.ObjectId;    
    lastMessage?: Schema.Types.ObjectId;
    admin: Schema.Types.ObjectId[];
};

export interface IChatMessageCreateStart {
    chat: Schema.Types.ObjectId;
    userSent: Schema.Types.ObjectId;    
    value: String;
    reply?: Schema.Types.ObjectId;
    like?: Schema.Types.ObjectId[];
    startChat?: boolean;
    type?: TMessageType;
    seenUsers: Schema.Types.ObjectId[];
    delivery: TMessageDelivery;
};