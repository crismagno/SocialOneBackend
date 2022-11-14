import UserEnum from "../../shared/user/user.enum";

export interface IUserWithToken {
  _id: string;
  avatar?: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserEnum.Roles;
  token: string;
}

export type TUpdateProfileInfo = ["fullName", "email", "phone"];
