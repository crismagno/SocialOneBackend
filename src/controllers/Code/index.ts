import { Schema } from "mongoose";
import { Request, Response } from "express";
import Code from "./../../models/Code";
import moment from "moment";
import Email from "./../../services/email";
import User from "../../models/User";
import { ICodeSchema } from "../../models/Code/types";
import { IUserSchema } from "../../models/User/types";

class CodeController {

    private lengthCode: number = 4;
    private codeHoursValidate: number = 24;

    public newCode = async (userId: Schema.Types.ObjectId): Promise<string> => {
        try {
            const code: ICodeSchema | null = await Code.findOne({ user: userId });
            const codeGenerate: string = this.makeCode();
            if (!code) {
                await Code.create({
                    user: userId,
                    code: codeGenerate,
                });
            } else {
                await Code.updateOne({ user: userId }, { 
                    $set: { code: codeGenerate } 
                });
            }

            return codeGenerate;
        } catch (error) {
            return "";
        }
    };

    private makeCode = (): string => {
        let result: string = "";
        let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength: number = characters.length;
        for ( let i = 0; i < this.lengthCode; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result.toUpperCase();
    };

    public validateCode = async (req: Request, res: Response): Promise<void|Response> => {
        try {
            const { userId, code } = req.body;

            if (!userId || !code || (code.length !== 4)) 
                return res.status(400).json({ message: "Error at validate code. [1]" }); 

            const user: IUserSchema | null = await User.findOne({ _id: userId });

            if (!user) 
                return res.status(400).json({ message: "Error user invalid" });

            const getCode: ICodeSchema | null = await Code.findOne({ user: userId });

            if (!getCode) 
                return res.status(400).json({ message: "Error at validate code. [2]" }); 

            if (getCode.code !== code) 
                return res.status(400).json({ message: "Error at validate code. [3]" });

            let codeIsBiggerThen24Hours: boolean = moment().diff(getCode.updatedAt, 'hours') >= this.codeHoursValidate; 
            
            if (codeIsBiggerThen24Hours) 
                return res.status(400).json({ message: "Error at validate code expires one day. [4]" });
            
            // if user is not active set user with active
            if (!user.active) {
                await User.updateOne({ _id: userId }, { 
                    $set: { active: true } 
                });
            }

            res.status(200).json({ message: "Code validated success!" });
                
            //after validate code generate new code to user!
            await this.newCode(user._id);

            return;
        } catch (error) {
            return res.status(400).json({ message: "Error at validate code. [5]" });
        }
    };

    public resendCode = async (req: Request, res: Response): Promise<Response> => {

        try {
            const { userId } = req.body;

            if (!userId) 
                return res.status(400).json({ message: "Error body data invalid" });

            let codeResult: string = ""; 

            const user: IUserSchema | null = await User.findOne({ _id: userId });

            if (!user) 
                return res.status(400).json({ message: "Error user invalid" });

            const getCode: ICodeSchema | null = await Code.findOne({ user: user._id });

            if (!getCode) {
                codeResult = await this.newCode(userId);
            } else {
                let codeIsBiggerThen24Hours: boolean = moment().diff(getCode.updatedAt, 'hours') >= this.codeHoursValidate; 
                if (codeIsBiggerThen24Hours) {
                    codeResult = await this.newCode(userId);
                } else {
                    codeResult = `${getCode.code}`;
                }
            }

            if (!!codeResult.trim()) {
                await Email.emailWelcome({
                    to: `${user.email}`,
                    fullName: `${user.fullName}`,
                    code: codeResult,
                });
            } else {
                return res.status(400).json({ message: "Error at resend code. Try Again!" });
            }

            return res.status(200).json({ message: "Code send success to E-mail or SMS" });
        } catch (error) {
            return res.status(400).json({ message: "Error at resend code! Network SocialOne. Try Again!" });
        };
    };
};

export default new CodeController();