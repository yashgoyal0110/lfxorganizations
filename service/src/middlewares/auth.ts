import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../env";
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: Number;
        username?: string;
        email?: string;
        avatarUrl?: string;
        userId: number;
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

  
    if (!JWT_SECRET) {
      console.error("Missing JWT_SECRET env variable.");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Verify JWT
    const decoded : any = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (err) {
    console.error("JWT Cookie Validation Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
