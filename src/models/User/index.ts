import { Schema, model } from "mongoose";
import { IUser } from "./types";
import UserEnum from "../../shared/user/user.enum";

const User: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    active: {
      type: Boolean,
      default: false,
    },
    online: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: Array,
      default: [],
    },
    emailChange: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: Object.keys(UserEnum.Roles),
    },
    status: {
      type: String,
      enum: Object.keys(UserEnum.Status),
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", User);
