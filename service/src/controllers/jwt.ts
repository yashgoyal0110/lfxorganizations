import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRY } from "../env";

export const generateJWT = (user: any): string => {
    try {
        console.log("Generating JWT for user:", user);
        return jwt.sign(
            user,
            JWT_SECRET,
            { expiresIn: `${JWT_EXPIRY}h` }
        );
    } catch (err) {
        console.error("Error generating JWT:", err);
        throw err;
    }
};