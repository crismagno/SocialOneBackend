require('dotenv').config({ path: `${__dirname}/../../.env` });
import crypto from "crypto";

const algorithm: string = 'aes-256-ctr';
const secretKey: string = `${process.env.JWT_SECRET_KEY}`;
const iv = crypto.randomBytes(16);

export const encrypt = (text: string) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

export const decrypt = (hash: any) => {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

export default {
    encrypt,
    decrypt
};