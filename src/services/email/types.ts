import { Schema } from "mongoose";

export interface ITemplate {
  subject: string;
  text?: (value: string) => string;
  html?: (fullName: string, code: string) => string;
  attachment?: any[];
}

export interface ITemplatesEmail {
  welcome: ITemplate;
  resendVerifyCode: ITemplate;
  changeEmail: ITemplate;
}

export interface IBodySendEmail {
  to: String | String[];
  subject: string;
  text?: string;
  html?: string;
}

export interface IBodyEmailResendVerifyCode {
  to: string;
  fullName: string;
  code: string;
}
