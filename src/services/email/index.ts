import CodeEnum from "../../models/Code/code.enum";
import Code from "../../controllers/Code";
import { IUserSchema } from "../../models/User/types";
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

class Email {
  private host = process.env.HOST;
  private port = process.env.PORT_EMAIL;
  private user = process.env.USER;
  private pass = process.env.PASS;

  private sendEmail = async (bodyEmail: IBodySendEmail): Promise<any> => {
    return new Promise((resolve: any, reject: any) => {
      if (!this.host || !this.port || !this.user || !this.pass) {
        reject("Error when try to send email. Empty or invalid parameters!");
      }

      const settingsEmail = {
        host: this.host,
        port: this.port,
        secure: true, // true for 465, false for other ports
        auth: { user: this.user, pass: this.pass },
        tls: { rejectUnauthorized: true, ciphers: "SSLv3" },
      };

      const transporter = nodemailer.createTransport(settingsEmail);

      const mailOptions = {
        from: this.user,
        ...bodyEmail,
      };

      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          console.log("error: ", error);
          reject(error);
        } else {
          console.log("info: ", info);
          resolve(info);
        }
      });
    });
  };

  public emailWelcome = async (user: IUserSchema): Promise<any> => {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const code: string = await Code.newCode(
          user?._id,
          CodeEnum.Types.VERIFY_CODE
        );

        if (!code.trim()) {
          reject("Error when try generate code. Code Empty!");
          return;
        }

        const chooseTemplate: ITemplate = templatesEmail.welcome;

        const responseEmail = await this.sendEmail({
          to: String(user?.email),
          subject: chooseTemplate.subject,
          html:
            chooseTemplate.html &&
            chooseTemplate.html(String(user?.fullName), code),
        });

        resolve(responseEmail);
      } catch (error) {
        reject(error);
      }
    });
  };

  public emailResendVerifyCode = async (
    bodyEmailResendVerifyCode: IBodyEmailResendVerifyCode
  ): Promise<any> => {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const chooseTemplate: ITemplate = templatesEmail.resendVerifyCode;

        const responseEmail = await this.sendEmail({
          to: bodyEmailResendVerifyCode.to,
          subject: chooseTemplate.subject,
          html:
            chooseTemplate.html &&
            chooseTemplate.html(
              bodyEmailResendVerifyCode.fullName,
              bodyEmailResendVerifyCode.code
            ),
        });

        resolve(responseEmail);
      } catch (error) {
        reject(error);
      }
    });
  };

  public emailToRequestChangeEmailUser = async (
    user: IUserSchema
  ): Promise<any> => {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const code = await Code.newCode(user._id, CodeEnum.Types.CHANGE_EMAIL);

        if (!code.trim() || !user) {
          reject("Error when try generate code. Code Empty or Invalid User!");
        }

        const chooseTemplate: ITemplate = templatesEmail.changeEmail;

        const responseEmail = await this.sendEmail({
          to: [String(user?.email), String(user?.emailChange)],
          subject: chooseTemplate.subject,
          html:
            chooseTemplate.html &&
            chooseTemplate.html(String(user?.fullName), code),
        });

        resolve(responseEmail);
      } catch (error) {
        reject(error);
      }
    });
  };

  public emailResendToRequestChangeEmailUser = async (
    user: IUserSchema,
    code: string
  ): Promise<any> => {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        if (!code.trim() || !user) {
          reject("Error when try generate code. Code Empty or Invalid User!");
        }

        const chooseTemplate: ITemplate = templatesEmail.changeEmail;
        const responseEmail = await this.sendEmail({
          to: [String(user?.email), String(user?.emailChange)],
          subject: chooseTemplate.subject,
          html:
            chooseTemplate.html &&
            chooseTemplate.html(String(user?.fullName), code),
        });

        resolve(responseEmail);
      } catch (error) {
        reject(error);
      }
    });
  };
}

export default new Email();
