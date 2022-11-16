import { Schema } from "mongoose";
import { Request, Response } from "express";
import Code from "./../../models/Code";
import moment from "moment";
import Email from "./../../services/email";
import User from "../../models/User";
import { ICodeSchema, TCode } from "../../models/Code/types";
import { IUser } from "../../models/User/types";
import GlobalSocket from "../../infra/GlobalSocket";
import CodeEnum from "../../models/Code/code.enum";

class CodeController {
  private lengthCode: number = 4;
  private codeHoursValidate: number = 24;

  public newCode = async (
    userId: Schema.Types.ObjectId,
    typeCode: TCode
  ): Promise<string> => {
    try {
      const code: ICodeSchema | null = await Code.findOne({
        user: userId,
        type: typeCode,
      });
      const codeGenerate: string | null = this.makeCode();

      if (!codeGenerate) {
        throw "Error to make Code";
      }

      if (!code) {
        await Code.create({
          user: userId,
          code: codeGenerate,
          type: typeCode,
        });
      } else {
        await Code.updateOne(
          { user: userId, type: typeCode },
          {
            $set: { code: codeGenerate },
          }
        );
      }

      return codeGenerate;
    } catch (error) {
      console.log(`Error to create newCode:
                [userId: ${userId}]
                [typeCode: ${typeCode}]
            `);
      return "";
    }
  };

  private makeCode = (): string | null => {
    try {
      let result: string = "";
      let characters: string = `${process.env.CHARACTERS}`;
      let charactersLength: number = characters.length;
      for (let i = 0; i < this.lengthCode; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result.toUpperCase();
    } catch (error) {
      console.log(`Error to makeCode `, error);
      return null;
    }
  };

  public validateCode = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { userId, code, typeCode = null } = req.body;

      if (!userId || !code || code.length !== 4 || !typeCode)
        return res.status(400).json({ message: "Error at validate code. [1]" });

      const user: IUser | null = await User.findOne({ _id: userId });

      if (!user) return res.status(400).json({ message: "Error user invalid" });

      const getCode: ICodeSchema | null = await Code.findOne({
        user: userId,
        type: typeCode,
      });

      if (!getCode)
        return res.status(400).json({ message: "Error at validate code. [2]" });

      if (getCode.code !== code)
        return res.status(400).json({ message: "Error at validate code. [3]" });

      let codeTimeIsGreatThan24Hours: boolean =
        moment().diff(getCode.updatedAt, "hours") >= this.codeHoursValidate;

      if (codeTimeIsGreatThan24Hours)
        return res
          .status(400)
          .json({ message: "Error at validate code expires one day. [4]" });

      // if user is not active set user with active
      if (!user.active) {
        await User.updateOne(
          { _id: userId },
          {
            $set: { active: true },
          }
        );
      }

      res.status(200).json({ message: "Code validated success!" });

      //after validate code generate new code to user!
      await this.newCode(user._id, typeCode);

      return;
    } catch (error) {
      console.log(
        `Error at validate code. [5] [userId${req.body.userId}]`,
        error
      );
      return res.status(400).json({ message: "Error at validate code. [5]" });
    }
  };

  public resendCode = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { userId, typeCode = null } = req.body;

      if (!userId || !typeCode)
        return res.status(400).json({ message: "Error body data invalid" });

      let codeResult: string = "";

      const user: IUser | null = await User.findOne({ _id: userId });

      if (!user) return res.status(400).json({ message: "Error user invalid" });

      const getCode: ICodeSchema | null = await Code.findOne({
        user: user._id,
        type: typeCode,
      });

      if (!getCode) {
        codeResult = await this.newCode(userId, typeCode);
      } else {
        let codeTimeIsGreatThan24Hours: boolean =
          moment().diff(getCode.updatedAt, "hours") >= this.codeHoursValidate;
        if (codeTimeIsGreatThan24Hours) {
          codeResult = await this.newCode(userId, typeCode);
        } else {
          codeResult = `${getCode.code}`;
        }
      }

      if (!!codeResult.trim()) {
        if (typeCode === CodeEnum.Types.VERIFY_CODE) {
          await Email.emailResendVerifyCode({
            to: `${user.email}`,
            fullName: `${user.fullName}`,
            code: codeResult,
          });
        }

        if (typeCode === CodeEnum.Types.CHANGE_EMAIL) {
          await Email.emailResendToRequestChangeEmailUser(user, codeResult);
        }
      } else {
        return res
          .status(400)
          .json({ message: "Error at resend code. Try Again!" });
      }

      return res
        .status(200)
        .json({ message: "Code send success to E-mail or SMS" });
    } catch (error) {
      console.log(
        `Error at resend code! Network SocialOne. Try Again!
                [userId${req.body.userId}]
            `,
        error
      );
      return res.status(400).json({
        message: "Error at resend code! Network SocialOne. Try Again!",
      });
    }
  };

  public validateCodeChangeEmail = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { userId, code, typeCode = null } = req.body;

      if (!userId || !code || code.length !== 4 || !typeCode)
        return res.status(400).json({ message: "Error at validate code. [1]" });

      const user: IUser | null = await User.findById({ _id: userId });

      if (!user) return res.status(400).json({ message: "Error user invalid" });

      const getCode: ICodeSchema | null = await Code.findOne({
        user: userId,
        type: typeCode,
      });

      if (!getCode)
        return res.status(400).json({ message: "Error at validate code. [2]" });

      if (getCode.code !== code)
        return res.status(400).json({ message: "Error at validate code. [3]" });

      let codeTimeIsGreatThan24Hours: boolean =
        moment().diff(getCode.updatedAt, "hours") >= this.codeHoursValidate;

      if (codeTimeIsGreatThan24Hours)
        return res
          .status(400)
          .json({ message: "Error at validate code expires one day. [4]" });

      // if user is not active set user with active
      if (!user?.emailChange?.trim()) {
        return res.status(400).json({
          message: "Error at validate code email to change don't exists. [6]",
        });
      }

      await User.updateOne(
        { _id: userId },
        {
          $set: {
            email: user.emailChange,
            emailChange: "",
          },
        }
      );

      res
        .status(200)
        .json({ message: "Code validated, and email updated with success!" });

      GlobalSocket.userUpdateProfileInfo({
        userId: user._id,
        property: "email",
        newValue: user.emailChange,
      });

      //after validate code generate new code to user!
      await this.newCode(user._id, typeCode);

      return;
    } catch (error) {
      console.log(
        `Code validated, and email updated with error
                [userId: ${req.body.userId}]`,
        error
      );
      return res.status(400).json({ message: "Error at validate code. [5]" });
    }
  };
}

export default new CodeController();
