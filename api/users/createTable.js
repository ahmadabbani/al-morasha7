// api/db/init.js
import pool from "../utils/db.js";

export default async function handler(req, res) {
  // Only allow POST method for table creation
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await pool.connect();

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR(255) NOT NULL,
          "phone" VARCHAR(20) UNIQUE NOT NULL,
          "email" VARCHAR(255) UNIQUE NOT NULL,
          "district" VARCHAR(100) NOT NULL,
          "role" VARCHAR(255) DEFAULT NULL,
          "status" BOOLEAN DEFAULT FALSE,
          "created_at" DATE DEFAULT CURRENT_DATE,
          "session_date" DATE,
          "session_time" TIME
        )
      `);

      return res.status(200).json({ message: "table created" });
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    console.error("Database initialization error:", error);
    return res.status(500).json({
      error: "failed to create table",
      details: error.message,
    });
  }
}
