import { Schema, model } from "mongoose";
import { IChatSchema } from "./types";

const ChatSchema: Schema = new Schema({
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
    },
    admin: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
}, {
    timestamps: true,
});

export default model<IChatSchema>("Chat", ChatSchema);