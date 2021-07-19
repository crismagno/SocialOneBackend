import { Document, Schema } from "mongoose";

export type TMessageType = "text" | "audio" | "document" | "image" | "video" | "figure" | "microphone";
export type TMessageDelivery = "send" | "delivered";

export interface IMessageSchema extends Document {
    chat: Schema.Types.ObjectId;
    userSent: Schema.Types.ObjectId;    
    value: String;
    reply?: Schema.Types.ObjectId;
    like?: Schema.Types.ObjectId[];
    startChat?: boolean;
    type: TMessageType;
    createdAt?: Date;
    updatedAt?: Date;
    seenUsers?: Schema.Types.ObjectId[]; 
    delivery?: TMessageDelivery;
    removeToUsers?: Schema.Types.ObjectId[]
};
