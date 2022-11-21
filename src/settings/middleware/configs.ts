import UserEnum from "../../shared/user/user.enum";
import { Request, Response } from "express";
import MainEnum from "../../shared/main/main.enum";
const compression = require("compression");

// Method that valid if request should be compressed
export const shouldCompress = (req: Request, res: Response) => {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
};

export const publicRoutes = {
  path: [
    MainEnum.Urls.INITIAL,
    UserEnum.Urls.SIGN_IN,
    UserEnum.Urls.SIGN_UP,
    // "/code/validate",
    /^\/files\/.*/,
    // "/chat",
    // "/chat/by_user",
    // "/chat/by_chat_id",
    // "/message/by_chat_id",
    // "/message/create",
  ],
};
