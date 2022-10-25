import Log from "./../../infra/Log";
import { Request } from "express";
import { IUserPayloadToken } from "./types";
// const jwt = require('jwt-simple')
const jwt = require("jsonwebtoken");

class Token {
  private readonly JWT_SECRET_KEY: string = `${process.env.JWT_SECRET_KEY}`;

  public generate = (payload: IUserPayloadToken): string =>
    jwt.sign(payload, this.JWT_SECRET_KEY);

  public decode = (req: Request): IUserPayloadToken | null => {
    try {
      const authorization: string | undefined = req.headers.authorization;

      if (!authorization) return null;

      const parts: string[] = authorization.split("");

      if (!(parts.length === 2)) return null;

      const [scheme, token]: string[] = parts;

      if (!/^Bearer$/i.test(scheme)) return null;

      if (!token) return null;

      const decoded: IUserPayloadToken = jwt.decode(token, this.JWT_SECRET_KEY);

      if (!decoded) return null;

      return decoded;
    } catch (error: any) {
      Log.error({ message: `Token Helper Decode: ${error.message}` });
      return null;
    }
  };
}

export default new Token();
