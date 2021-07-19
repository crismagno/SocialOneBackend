require('dotenv').config({ path: `${__dirname}/../../../.env` });
import { Request } from "express";
import { IUserGenerateToken } from "./types";
// const jwt = require('jwt-simple')
const jwt = require("jsonwebtoken");

class Token {

    private JWT_SECRET_KEY: string = String(process.env.JWT_SECRET_KEY); 

    public generate = (payload: IUserGenerateToken): string => {
        return jwt.sign(payload, this.JWT_SECRET_KEY);
    };

    public decode = async (req: Request) => {
        try {
            const authorization = req.headers.authorization;
    
            if (!authorization) return null;
    
            const parts: string[] = authorization.split("");
    
            if (!(parts.length === 2)) return null;
    
            const [scheme, token] = parts;
    
            if (!/^Bearer$/i.test(scheme)) return null;
    
            if (!token) return null;
    
            const decoded = jwt.decode(token, this.JWT_SECRET_KEY);
            
            if (!decoded) return null;
                
            return decoded;
        } catch (err) {
            console.error('Token Helper Decode', err);
            return null;
        };
    };
};

export default new Token();

