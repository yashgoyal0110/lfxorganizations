import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { DATABASE_URL } from "./env";

dotenv.config();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL
  },
});
