// api/users/verify.js
import pool from "../utils/db.js";
const allowedOrigins = [
  "http://localhost:5173", // Frontend URL during development
  // Add production domain when deploying
];
// Error and success messages in Arabic
const errors = {
  METHOD_NOT_ALLOWED: "الطريقة غير مسموح بها",
  TOKEN_REQUIRED: "رمز التحقق مطلوب",
  TOKEN_INVALID: "رمز التحقق غير صالح أو منتهي الصلاحية",
  VERIFICATION_FAILED: "فشل التحقق من البريد الإلكتروني",
};

const success = {
  VERIFICATION_SUCCESS: "تم التحقق من البريد الإلكتروني بنجاح",
};

export default async function handler(req, res) {
  // Get the origin from the request
  const origin = req.headers.origin;
  console.log("Request origin:", origin); // Log the incoming origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET" && req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({ error: errors.METHOD_NOT_ALLOWED });
  }

  // Get token from query params (GET) or request body (POST)
  const token = req.method === "PUT" ? req.query.token : req.body.token;

  if (!token) {
    return res.status(400).json({ error: errors.TOKEN_REQUIRED });
  }

  try {
    const client = await pool.connect();

    try {
      // Find user with this verification token and check if it's still valid
      const currentTime = new Date();
      const result = await client.query(
        `SELECT * FROM users 
         WHERE verification_token = $1 
         AND token_expiry > $2 
         AND is_verified = false`,
        [token, currentTime]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ error: errors.TOKEN_INVALID });
      }

      // Update user to verified status
      await client.query(
        `UPDATE users 
         SET is_verified = true, 
             email_verified_at = $1, 
             verification_token = NULL, 
             token_expiry = NULL 
         WHERE verification_token = $2`,
        [currentTime, token]
      );
      return res.status(200).json({ message: success.VERIFICATION_SUCCESS });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({
      error: errors.VERIFICATION_FAILED,
      details: error.message,
    });
  }
}
