// api/users/me.js
import pool from "../utils/db.js";
import jwt from "jsonwebtoken";
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
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // Verify token from cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "غير مصرح به" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const user = await pool.query(
      `SELECT id, name, email, phone, status, district, role, "isAdmin", "isPayed", session_date::date as session_date,
              to_char(session_time, 'HH24:MI') as session_time 
       FROM users WHERE id = $1`,
      [decoded.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    return res.status(200).json(user.rows[0]);
  } catch (error) {
    return res.status(401).json({ error: "جلسة غير صالحة" });
  }
}
