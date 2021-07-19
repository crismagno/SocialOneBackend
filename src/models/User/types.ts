import { Document } from "mongoose";

export interface IUserSchema extends Document{
    fullName?: String;
    email?: String;
    password?: String;
    avatar?: String | null;
    phone?: String;
    active?: Boolean;
    online?: Boolean;
    socketId?: Array<any> | null;
    createdAt?: Date;
    updatedAt?: Date;
    emailChange?: string | null;
};