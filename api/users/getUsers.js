import pool from "../utils/db.js";

export default async function handler(req, res) {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: error.message });
  }
}
