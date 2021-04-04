import { 
    ITemplatesEmail, 
    IBodyEmailWelcome, 
    IBodySendEmail, 
    ITemplate 
} from "./types";
const nodemailer = require("nodemailer");

const templatesEmail: ITemplatesEmail = {
  welcome: {
    subject: "Welcome to SocialOne!",
    text: (value: string) => `Hello! ${value} now you are SocialOne.`,
    html: (fullName: string, code: string) =>
      `<div>Hello! ${fullName} now you are SocialOne! Your code is <strong>${code}</strong>.</div>`,
  },
};

class Email {
    private host = process.env.HOST;
    private port = process.env.PORT_EMAIL;
    private user = process.env.USER;
    private pass = process.env.PASS;

    private sendEmail = async (bodyEmail: IBodySendEmail): Promise<boolean> => {
        return new Promise((resolve: any) => {
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

    public emailWelcome = async (bodyEmailWelcome: IBodyEmailWelcome): Promise<boolean> => {
        return new Promise(async (resolve: any) => {
            try {
                const chooseTemplate: ITemplate = templatesEmail.welcome;
                const responseEmail = await this.sendEmail({
                    to: bodyEmailWelcome.to,
                    subject: chooseTemplate.subject,
                    html: chooseTemplate.html && chooseTemplate.html(bodyEmailWelcome.fullName, bodyEmailWelcome.code),
                });
                resolve(responseEmail);
            } catch (error) {
                resolve(false);
            };
        });
    };
}

export default new Email();