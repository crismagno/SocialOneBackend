import { Schema } from "mongoose";

export interface IUserPayloadToken {
  _id: Schema.Types.ObjectId;
  expires: number;
}
