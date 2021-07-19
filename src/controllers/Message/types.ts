import { TMessageDelivery, TMessageType } from "../../models/Message/types";
import { Schema } from "mongoose";

export interface IMessageCreateSchema {
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
};