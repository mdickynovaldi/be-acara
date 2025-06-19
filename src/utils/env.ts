import dotenv from "dotenv";

// Load environment variables dari file .env
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL || "";