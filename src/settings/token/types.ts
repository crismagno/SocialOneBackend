import { Schema } from "mongoose";

export interface IUserGenerateToken {
    _id: Schema.Types.ObjectId;
    expires: number;
}; 