export interface IUserWithToken {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    avatar?: string;
    token: string;
};