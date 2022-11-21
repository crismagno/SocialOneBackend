import EmailEnum from "../../shared/email/email.enum";

export const isValidEmail = (email: string): boolean =>
  EmailEnum.regexEmail.test(email);

export const sleepAsync = async (time: number = 0) =>
  new Promise((resolve: any) =>
    setTimeout(() => {
      resolve();
    }, time)
  );
