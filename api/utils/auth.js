// utils/auth.js (shared middleware)
import pool from "./db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Allowed origins (update with your domains)
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://al-morasha7.vercel.app", // Production frontend URL
  "https://almourachah.org",
];
export async function requireAdmin(req, res) {
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
  const token = req.cookies.token;
  if (!token) throw new Error("Unauthorized");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query('SELECT "isAdmin" FROM users WHERE id = $1', [
      decoded.id,
    ]);
    console.log(decoded.id);
    if (!user.rows[0]?.isAdmin) {
      throw new Error("Forbidden");
    }
    // Attach user data to the request for later use
    req.user = user.rows[0];
  } catch (error) {
    throw error; // Propagate the error
  }
}
