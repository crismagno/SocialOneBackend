import { Document, Schema } from "mongoose";

export interface ICodeSchema extends Document{
    user?: Schema.Types.ObjectId;
    code?: String;    
    createdAt?: Date;
    updatedAt?: Date;
};