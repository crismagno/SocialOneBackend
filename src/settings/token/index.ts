import Log from "./../../infra/Log";
import { Request } from "express";
import { IUserPayloadToken } from "./types";
const jwt = require("jsonwebtoken");

export default class Token {
  private static readonly JWT_SECRET_KEY: string = `${process.env.JWT_SECRET_KEY}`;

  public static generate = (payload: IUserPayloadToken): string =>
    jwt.sign(payload, Token.JWT_SECRET_KEY);

  public static decode = (req: Request): IUserPayloadToken | null => {
    try {
      const authorization: string | undefined = req.headers.authorization;

      if (!authorization) return null;

      const parts: string[] = authorization.split("");

      if (!(parts.length === 2)) return null;

      const [scheme, token]: string[] = parts;

      if (!/^Bearer$/i.test(scheme)) return null;

      if (!token) return null;

      const decoded: IUserPayloadToken = jwt.decode(
        token,
        Token.JWT_SECRET_KEY
      );

      if (!decoded) return null;

      return decoded;
    } catch (error: any) {
      Log.error({ message: `Token Helper Decode: ${error.message}` });
      return null;
    }
  };
}
