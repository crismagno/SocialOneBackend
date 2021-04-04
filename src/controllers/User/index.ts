import User from "./../../models/User/index";
import { Request, Response } from "express";
import { IUserSchema } from "../../models/User/types";
import { IUserWithToken } from "./types";
import { IUserGenerateToken } from "../../settings/token/types";
import { validateEmail } from "./../../helpers/global";
import Email from "../../services/email";
import Code from "../../controllers/Code";
import Token from "../../settings/token";
import { scheduleValidateUserActive } from "./../../services/schedule";
const bcrypt = require("bcrypt");

class UserController {
  private saltRounds: number = 10;

  public getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users: IUserSchema[] = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  public signIn = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ message: "Data informed is invalid" });

      if (!validateEmail(email))
        return res.status(400).json({ message: "Format email invalid" });

      const userDB: IUserSchema | null = await User.findOne({ email });

      if (!userDB)
        return res.status(400).json({ message: "Email or Password invalid" });

      const passwordCompare = await bcrypt.compare(password, userDB.password);
      if (!passwordCompare)
        return res.status(400).json({ message: "Email or Password invalid" });

      const payload: IUserGenerateToken = {
        _id: userDB._id,
        expires: Date.now() + 1000 * 60 * 24,
      };

      const userWithToken: IUserWithToken = {
        _id: `${userDB._id}`,
        fullName: `${userDB.fullName}`,
        email: `${userDB.email}`,
        phone: `${userDB.phone}`,
        avatar: `${userDB.avatar}`,
        token: Token.generate(payload),
      };

      res.status(201).json(userWithToken);

      const code = await Code.newCode(userDB._id);

      if (!!code.trim()) {
        await Email.emailWelcome({
          to: `${userDB.email}`,
          fullName: `${userDB.fullName}`,
          code,
        });
      }

      return;
    } catch (error) {
      return res.status(400).json({ message: "Error Social network" });
    }
  };

  public create = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { fullName, email, password, phone } = req.body;

      if (!fullName || !email || !phone || !password)
        return res.status(409).json({ message: "Data informed is invalid" });

      if (!validateEmail(email))
        return res.status(409).json({ message: "Format email invalid" });

      const userDB: IUserSchema[] | null = await User.find({
        $or: [{ email }, { phone }],
      });

      if (userDB && userDB.length > 0 && userDB[0].email === email)
        return res.status(409).json({ message: "Email not allowed" });

      if (userDB && userDB.length > 0 && userDB[0].phone === phone)
        return res.status(409).json({ message: "Phone not allowed" });

      const passwordWithBcrypt = bcrypt.hashSync(password, this.saltRounds);

      const user: IUserSchema = await User.create({
        fullName,
        email,
        phone,
        password: passwordWithBcrypt,
      });

      const payload: IUserGenerateToken = {
        _id: user._id,
        expires: Date.now() + 1000 * 60 * 24,
      };

      const userWithToken: IUserWithToken = {
        _id: `${user._id}`,
        fullName: `${user.fullName}`,
        email: `${user.email}`,
        phone: `${user.phone}`,
        avatar: `${user.avatar}`,
        token: Token.generate(payload),
      };

      res.status(201).json(userWithToken);

      // validate if user active account or delete user
      scheduleValidateUserActive(user._id);

      const code = await Code.newCode(user._id);

      if (!!code.trim()) {
        await Email.emailWelcome({
          to: `${user.email}`,
          fullName: `${user.fullName}`,
          code,
        });
      }

      return;
    } catch (error) {
      return res.status(409).json({ message: "Error Social network" });
    }
  };
}

export default new UserController();
