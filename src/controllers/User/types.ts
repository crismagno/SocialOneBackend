export interface IUserWithToken {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    avatar?: string;
    token: string;
};

export type TUpdateProfileInfo =  ["fullName", "email", "phone"]