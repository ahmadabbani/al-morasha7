import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false, // Disable SSL for local development
});

// Set Lebanon timezone for all connections
pool.on("connect", (client) => {
  client.query(`SET TIMEZONE='Asia/Beirut'`);
});

export default pool;
