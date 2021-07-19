import { Schema, model } from "mongoose";
import { IMessageSchema } from "./types";

const MessageSchema: Schema = new Schema({
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    userSent: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },    
    value: {
        type: String,
        required: true,
    },
    reply: {
        type: Schema.Types.ObjectId,
        ref: "Message",
    },
    like: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    type: {
        type: String,
        enum: ["text", "audio", "document", "image", "video", "figure"],
        required: true,
    },
    seenUsers: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    delivery: {
        type: String,
        enum: ["send", "delivered"],
    },
    startChat: {
        type: Boolean,
    },
    removeToUsers: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
}, {
    timestamps: true,
});

export default model<IMessageSchema>("Message", MessageSchema);