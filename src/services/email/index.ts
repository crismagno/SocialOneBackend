import CodeEnum from "../../shared/code/code.enum";
import Code from "../../controllers/Code";
import { IUser } from "../../models/User/types";
import {
  ITemplatesEmail,
  IBodySendEmail,
  ITemplate,
  IBodyEmailResendVerifyCode,
} from "./types";
const nodemailer = require("nodemailer");

const templatesEmail: ITemplatesEmail = {
  welcome: {
    subject: "Welcome to SocialOne!",
    text: (value: string) => `Hello! ${value} now you are SocialOne.`,
    html: (fullName: string, code: string) =>
      `<div>Hello! ${fullName} now you are SocialOne! Your code is <strong>${code}</strong>.</div>`,
  },
  resendVerifyCode: {
    subject: "Resend Verify Code to SocialOne!",
    text: (value: string) => `Resend code -> ${value}`,
    html: (fullName: string, code: string) =>
      `<div>Hello! ${fullName} Your code is <strong>${code}</strong>.</div>`,
  },
  changeEmail: {
    subject: "Send code to change email!",
    text: (value: string) => `Code -> ${value}`,
    html: (fullName: string, code: string) =>
      `<div>Hello! ${fullName} Your code is <strong>${code}</strong>.</div>`,
  },
};

export default class Email {
  private static readonly host = process.env.HOST;
  private static readonly port = process.env.PORT_EMAIL;
  private static readonly user = process.env.USER;
  private static readonly pass = process.env.PASS;

  private static _send = async (bodyEmail: IBodySendEmail): Promise<any> => {
    return new Promise((resolve: any, reject: any) => {
      if (!Email.host || !Email.port || !Email.user || !Email.pass) {
        reject("Error when try to send email. Empty or invalid parameters!");
      }

      const settingsEmail = {
        host: Email.host,
        port: Email.port,
        secure: true, // true for 465, false for other ports
        auth: { user: Email.user, pass: Email.pass },
        tls: { rejectUnauthorized: true, ciphers: "SSLv3" },
      };

      const transporter = nodemailer.createTransport(settingsEmail);

      const mailOptions = {
        from: Email.user,
        ...bodyEmail,
      };

      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  };

  public static emailWelcome = async (user: IUser): Promise<any> => {
    const code: string = await Code.newCode(
      user?._id,
      CodeEnum.Types.VERIFY_CODE
    );

    if (!code.trim()) {
      throw new Error("Error when try generate code. Code Empty!");
    }

    const chooseTemplate: ITemplate = templatesEmail.welcome;

    const responseEmail = await Email._send({
      to: String(user?.email),
      subject: chooseTemplate.subject,
      html:
        chooseTemplate.html &&
        chooseTemplate.html(String(user?.fullName), code),
    });

    return responseEmail;
  };

  public static emailResendVerifyCode = async (
    bodyEmailResendVerifyCode: IBodyEmailResendVerifyCode
  ): Promise<any> => {
    const chooseTemplate: ITemplate = templatesEmail.resendVerifyCode;

    const responseEmail = await Email._send({
      to: bodyEmailResendVerifyCode.to,
      subject: chooseTemplate.subject,
      html:
        chooseTemplate.html &&
        chooseTemplate.html(
          bodyEmailResendVerifyCode.fullName,
          bodyEmailResendVerifyCode.code
        ),
    });

    return responseEmail;
  };

  public static emailToRequestChangeEmailUser = async (
    user: IUser
  ): Promise<any> => {
    const code: string = await Code.newCode(
      user._id,
      CodeEnum.Types.CHANGE_EMAIL
    );

    if (!code.trim() || !user) {
      throw new Error(
        "Error when try generate code. Code Empty or Invalid User!"
      );
    }

    const chooseTemplate: ITemplate = templatesEmail.changeEmail;

    const responseEmail = await Email._send({
      to: [String(user?.email), String(user?.emailChange)],
      subject: chooseTemplate.subject,
      html:
        chooseTemplate.html &&
        chooseTemplate.html(String(user?.fullName), code),
    });

    return responseEmail;
  };

  public static emailResendToRequestChangeEmailUser = async (
    user: IUser,
    code: string
  ): Promise<any> => {
    if (!code.trim() || !user) {
      throw new Error(
        "Error when try generate code. Code Empty or Invalid User!"
      );
    }

    const chooseTemplate: ITemplate = templatesEmail.changeEmail;
    const responseEmail = await Email._send({
      to: [String(user?.email), String(user?.emailChange)],
      subject: chooseTemplate.subject,
      html:
        chooseTemplate.html &&
        chooseTemplate.html(String(user?.fullName), code),
    });

    return responseEmail;
  };
}
