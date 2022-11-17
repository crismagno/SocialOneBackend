namespace UserEnum {
  export enum Urls {
    GET_USERS = "/user",
    SIGN_IN = "/user/signin",
    SIGN_UP = "/user/signup",
    GET_USER_BY_ID = "/user/by_id",
    LOGOUT = "/user/logout",
    UPDATE_AVATAR = "/user/avatar",
    UPDATE_PROFILE_INFO = "/user/profile",
    UPDATE_EMAIL = "/user/change_email",
    VALIDATE_EXISTS_EMAIL_CHANGE = "/user/validate_exists_email_change",
    CANCEL_EMAIL_PENDING_CHANGE = "/user/cancel_email_pending_change",
    VALIDATE_PASSWORD = "/user/validate_password",
    UPDATE_PASSWORD = "/user/update_password",
  }

  export enum Roles {
    NORMAL = "NORMAL",
    MASTER = "MASTER",
  }

  export enum Status {
    INACTIVE = "INACTIVE",
  }
}

export default UserEnum;
