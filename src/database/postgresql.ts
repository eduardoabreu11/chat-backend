import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida no .env");
}

const isRenderExternal =
  process.env.DATABASE_URL.includes("render.com") ||
  process.env.DATABASE_URL.includes("render.internal");

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRenderExternal ? { rejectUnauthorized: false } : false,
});

export default db;