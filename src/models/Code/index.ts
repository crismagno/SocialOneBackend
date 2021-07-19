import { Schema, model } from "mongoose";
import { ICodeSchema } from "./types";

const CodeSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["VERIFY_CODE", "CHANGE_EMAIL"]
    }
}, {
    timestamps: true,
});

export default model<ICodeSchema>("Code", CodeSchema);