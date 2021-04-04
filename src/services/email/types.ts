export interface ITemplate {
    subject: string;
    text?: (value: string) => string;
    html?: (fullName: string, code: string) => string;
    attachment?: any[];
  }
  
  export interface ITemplatesEmail {
    welcome: ITemplate;
  }
  
  export interface IBodySendEmail {
      to: string
      subject: string
      text?: string
      html?: string
  }
  
  export interface IBodyEmailWelcome {
      to: string;
      fullName: string;
      code: string;
  }