// Get all users endpoint and accept a session endpoint
import pool from "../utils/db.js";
import { requireAdmin } from "../utils/auth.js";
import dotenv from "dotenv";
dotenv.config();
// Allowed origins (update with your domains)
const allowedOrigins = [
  "http://localhost:5173", // Local development
  // Production url
];
export default async function handler(req, res) {
  // Set CORS headers dynamically
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // First, validate admin status
  try {
    await requireAdmin(req, res);
  } catch (error) {
    if (error.message === "Unauthorized") {
      return res.status(401).json({ error: "Unauthorized" });
    } else if (error.message === "Forbidden") {
      return res.status(403).json({ error: "Forbidden" });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "GET") {
    try {
      const client = await pool.connect();
      try {
        const users = await client.query(`
            SELECT 
              id,
              name,
              phone,
              email,
              district,
              role,
              status,
              "isPayed",
              session_date::date as session_date,
              to_char(session_time, 'HH24:MI') as session_time,
              created_at
            FROM users
            WHERE "isAdmin" = false
            ORDER BY created_at DESC
          `);

        return res.status(200).json(users.rows);
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    const { userId } = req.body;

    try {
      const client = await pool.connect();
      try {
        await client.query("UPDATE users SET status = true WHERE id = $1", [
          userId,
        ]);

        return res
          .status(200)
          .json({ message: "User status updated successfully" });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
