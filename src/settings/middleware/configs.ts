import { Request, Response } from "express";
const compression = require("compression");

// Method that valid if request has compress
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
    "/",
    "/user/signin",
    "/user/signup",
    // "/code/validate",
    /^\/files\/.*/,
    // "/chat",
    // "/chat/by_user",
    // "/chat/by_chat_id",
    // "/message/by_chat_id",
    // "/message/create",
  ],
};
