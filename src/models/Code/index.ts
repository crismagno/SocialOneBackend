import { Schema, model } from "mongoose";
import { ICodeSchema } from "./types";
import CodeEnum from "../../shared/code/code.enum";

const CodeSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    code: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.keys(CodeEnum.Types),
    },
  },
  {
    timestamps: true,
  }
);

export default model<ICodeSchema>("Code", CodeSchema);
