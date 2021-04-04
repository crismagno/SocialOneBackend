import { Document } from "mongoose";

export interface IUserSchema extends Document{
    fullName?: String;
    email?: String;
    password?: String;
    avatar?: String;
    phone?: String;
    active?: Boolean;
    online?: Boolean;
    createdAt?: Date;
    updatedAt?: Date;
};