import { Document, Schema } from "mongoose";

export type TCode = "VERIFY_CODE" | "CHANGE_EMAIL";

export interface ICodeSchema extends Document{
    user?: Schema.Types.ObjectId;
    code?: String;    
    type?: TCode;
    createdAt?: Date;
    updatedAt?: Date;
};