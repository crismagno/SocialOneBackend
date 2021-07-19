import { Document, Schema } from "mongoose";

export interface IChatSchema extends Document {
    users: Schema.Types.ObjectId[];
    creator: Schema.Types.ObjectId;    
    lastMessage?: Schema.Types.ObjectId;
    admin: Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
};