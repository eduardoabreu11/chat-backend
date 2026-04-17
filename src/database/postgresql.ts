import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ✅ NOME CORRETO
  ssl: {
    rejectUnauthorized: false
  }
});

export const query = async (text, params) => {
  const result = await pool.query(text, params);
  return result.rows;
};

export default pool;