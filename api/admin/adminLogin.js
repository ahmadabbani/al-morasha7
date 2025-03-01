import pool from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import dotenv from "dotenv";
dotenv.config();
// Allow specific origin (not wildcard)
const allowedOrigins = [
  "http://localhost:5173", // frontend URL
  // Add production domain
];
export default async function handler(req, res) {
  // Get the origin from the request
  const origin = req.headers.origin;
  // Set CORS headers conditionally
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Add this
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight (OPTIONS) request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "الطريقة غير مسموح بها" });
  }

  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "جميع الحقول مطلوبة" });
  }

  try {
    const client = await pool.connect();

    try {
      // Find admin by email and isAdmin = true
      const user = await client.query(
        'SELECT * FROM users WHERE email = $1 AND "isAdmin" = TRUE',
        [email]
      );

      if (user.rows.length === 0) {
        return res.status(404).json({ error: "البريد الإلكتروني غير موجود" });
      }

      // Compare passwords
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );
      if (!validPassword) {
        return res.status(401).json({ error: "كلمة المرور غير صحيحة" });
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: user.rows[0].id,
          name: user.rows[0].name,
        },
        process.env.JWT_SECRET, // Add this to your Vercel environment variables
        { expiresIn: "8h" } // Token expires in 1 day
      );

      // Set JWT in HTTP-only cookie
      res.setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production", // Secure in production
          maxAge: 8 * 3600, // 8 hours in seconds
        })
      );

      // Return non-sensitive user data
      return res.status(200).json({
        message: "تم تسجيل الدخول بنجاح",
        user: {
          id: user.rows[0].id,
          name: user.rows[0].name,
          email: user.rows[0].email,
          phone: user.rows[0].phone,
          status: user.rows[0].status,
          district: user.rows[0].district,
          role: user.rows[0].role,
          isPayed: user.rows[0].isPayed,
          isAdmin: user.rows[0].isAdmin,
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "حدث خطأ أثناء تسجيل الدخول",
      details: error.message,
    });
  }
}
