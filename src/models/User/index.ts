import { Schema, model } from "mongoose";
import { IUserSchema } from "./types";

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
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
        default: "",
    },
    active: {
        type: Boolean,
        default: false,
    },
    online: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default model<IUserSchema>("User", UserSchema);