import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { user } from '../types/users';
dotenv.config();

export const generateJWT = (user: user): string => {
    try {
        console.log("Generating JWT for user:", user);
        return jwt.sign(
            user,
            process.env.JWT_SECRET as string,
            { expiresIn: `${process.env.JWT_EXPIRY}h` }
        );
    } catch (err) {
        console.error("Error generating JWT:", err);
        throw err;
    }
};