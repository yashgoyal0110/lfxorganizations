import axios from "axios";
import { Request, Response } from "express";
import { addUser, findUserByEmailOrUserName } from "./users";
import { generateJWT } from "./jwt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const githubLogin = async (
    req: Request,
    res: Response
): Promise<void> => {
    const code = req.query.code as string;
    console.log("Received code:", code);
    if (!code) res.status(400).json({ error: "Missing code parameter" });

    try {
        // Step 1: Exchange code for access token
        const tokenResponse = await axios.post(
            `https://github.com/login/oauth/access_token`,
            {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code,
            },
            { headers: { accept: "application/json" } }
        );
        const access_token = tokenResponse.data.access_token;

        // Step 2: Fetch user info
        const userResponse = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const isExisitng = await findUserByEmailOrUserName(
            userResponse.data.email,
            userResponse.data.login
        );
        console.log("User existence check:", isExisitng);
        if (!isExisitng) {
            console.log("User does not exist, creating new user.");
            await addUser(
                userResponse.data.name,
                userResponse.data.login,
                userResponse.data.email
            );
        }

        const token = generateJWT(userResponse.data);
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: false,
            maxAge: Number(process.env.COOKIE_EXPIRY),
            sameSite: "lax",
            path: "/",
        });

        return res.redirect(`${process.env.FRONTEND_URL}`);
    } catch (error) {
        res.status(500).json({ error: "OAuth failed" });
    }
};

export const logOut = (req: Request, res: Response): void => {
    res.clearCookie("auth_token", { path: "/" });
    res.status(200).json({ message: "Logged out successfully" });
}

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.auth_token;
        console.log("Auth token from cookies:");

        if (!token) {
            res.status(401).json({ user: null });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

        res.json({
            user: {
               payload
            },
        });
    } catch (err) {
        res.status(401).json({ user: null });
    }
};
