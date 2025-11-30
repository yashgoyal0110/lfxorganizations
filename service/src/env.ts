import dotenv from 'dotenv';
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL as string;

export const PORT = Number(process.env.PORT)

export const FRONTEND_URL = process.env.FRONTEND_URL as string;

export const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
export const CLIENT_ID = process.env.CLIENT_ID as string;

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRY = Number(process.env.JWT_EXPIRY)

export const COOKIE_EXPIRY = Number(process.env.COOKIE_EXPIRY);

export const ENVIRONMENT = process.env.ENVIRONMENT as string