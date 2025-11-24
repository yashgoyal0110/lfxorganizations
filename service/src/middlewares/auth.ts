import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username?: string;
        email?: string;
        avatarUrl?: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    "enterred auth middleware";
    // JWT is stored in cookie named "token"
    const token = req.cookies?.auth_token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token in cookies" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("Missing JWT_SECRET env variable.");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, secret);

    req.user = decoded as any;

    return next();
  } catch (err) {
    console.error("JWT Cookie Validation Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
