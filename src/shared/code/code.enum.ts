namespace CodeEnum {
  export enum Urls {
    VALIDATE = "/code/validate",
    RESEND = "/code/resend",
    VALIDATE_CHANGE_EMAIL = "/code/validate_change_email",
  }

  export enum Types {
    VERIFY_CODE = "VERIFY_CODE",
    CHANGE_EMAIL = "CHANGE_EMAIL",
  }
}

export default CodeEnum;
