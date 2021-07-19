require('dotenv').config({ path: `${__dirname}/../../../.env` });
import Code from "../../controllers/Code";
import { IUserSchema } from "../../models/User/types";
import { 
    ITemplatesEmail,
    IBodySendEmail, 
    ITemplate, 
    IBodyEmailResendVerifyCode
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

    private sendEmail = async (bodyEmail: IBodySendEmail): Promise<boolean> => {
        return new Promise((resolve: any) => {

            if (!this.host || !this.port || !this.user || !this.pass) {
                resolve(false);
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
                ...bodyEmail
            };
        
            transporter.sendMail(mailOptions, (error: any, info: any) => {
                if (error) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    };

    public emailWelcome = async (user: IUserSchema): Promise<boolean> => {
        return new Promise(async (resolve: any) => {
            try {
                const code = await Code.newCode(user?._id, "VERIFY_CODE");
                if (!!code.trim()) {
                    const chooseTemplate: ITemplate = templatesEmail.welcome;
                    const responseEmail = await this.sendEmail({
                        to: String(user?.email),
                        subject: chooseTemplate.subject,
                        html: chooseTemplate.html && chooseTemplate.html(String(user?.fullName), code),
                    });
                    resolve(responseEmail);
                    return;
                }
                resolve(false)
            } catch (error) {
                resolve(false);
            };
        });
    };

    public emailResendVerifyCode = async (bodyEmailResendVerifyCode: IBodyEmailResendVerifyCode): Promise<boolean> => {
        return new Promise(async (resolve: any) => {
            try {
                const chooseTemplate: ITemplate = templatesEmail.resendVerifyCode;
                const responseEmail = await this.sendEmail({
                    to: bodyEmailResendVerifyCode.to,
                    subject: chooseTemplate.subject,
                    html: chooseTemplate.html && chooseTemplate.html(bodyEmailResendVerifyCode.fullName, bodyEmailResendVerifyCode.code),
                });
                resolve(responseEmail);
            } catch (error) {
                resolve(false);
            };
        });
    };

    public emailToRequestChangeEmailUser = async (user: IUserSchema): Promise<boolean> => {
        return new Promise(async (resolve: any) => {
            try {
                const code = await Code.newCode(user._id, "CHANGE_EMAIL");
                if (!!code.trim() && user) {
                    const chooseTemplate: ITemplate = templatesEmail.changeEmail;
                    const responseEmail = await this.sendEmail({
                        to: [String(user?.email), String(user?.emailChange)],
                        subject: chooseTemplate.subject,
                        html: chooseTemplate.html && chooseTemplate.html(String(user?.fullName), code),
                    });
                    resolve(responseEmail);
                    return;
                }
                resolve(false)
            } catch (error) {
                resolve(false);
            };
        });
    };

    public emailResendToRequestChangeEmailUser = async (user: IUserSchema, code: string): Promise<boolean> => {
        return new Promise(async (resolve: any) => {
            try {
                if (!!code.trim() && user) {
                    const chooseTemplate: ITemplate = templatesEmail.changeEmail;
                    const responseEmail = await this.sendEmail({
                        to: [String(user?.email), String(user?.emailChange)],
                        subject: chooseTemplate.subject,
                        html: chooseTemplate.html && chooseTemplate.html(String(user?.fullName), code),
                    });
                    resolve(responseEmail);
                    return;
                }
                resolve(false)
            } catch (error) {
                resolve(false);
            };
        });
    };
}

export default new Email();