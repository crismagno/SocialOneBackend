import { Schema, model } from "mongoose";
import { ICodeSchema } from "./types";

const CodeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    code: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

export default model<ICodeSchema>("Code", CodeSchema);