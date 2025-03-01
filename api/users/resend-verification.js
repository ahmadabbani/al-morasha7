// api/users/resend-verification.js
import pool from "../utils/db.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailService.js";

// Error and success messages in Arabic
const errors = {
  METHOD_NOT_ALLOWED: "الطريقة غير مسموح بها",
  EMAIL_REQUIRED: "البريد الإلكتروني مطلوب",
  USER_NOT_FOUND: "لم يتم العثور على المستخدم",
  ALREADY_VERIFIED: "تم التحقق من البريد الإلكتروني بالفعل",
  EMAIL_FAILED: "فشل إرسال بريد التحقق",
};

const success = {
  EMAIL_SENT: "تم إرسال رابط التحقق، يرجى التحقق من بريدك الإلكتروني",
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: errors.METHOD_NOT_ALLOWED });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: errors.EMAIL_REQUIRED });
  }

  try {
    const client = await pool.connect();

    try {
      // Find user by email
      const result = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: errors.USER_NOT_FOUND });
      }

      const user = result.rows[0];

      // Check if already verified
      if (user.is_verified) {
        return res.status(400).json({ error: errors.ALREADY_VERIFIED });
      }

      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Set token expiry time (24 hours from now)
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24);

      // Update user with new verification token
      await client.query(
        `UPDATE users 
         SET verification_token = $1, 
             token_expiry = $2
         WHERE id = $3`,
        [verificationToken, tokenExpiry, user.id]
      );

      // Send verification email
      const emailResult = await sendVerificationEmail(
        user.email,
        user.name,
        verificationToken
      );

      if (!emailResult.success) {
        return res.status(500).json({
          error: errors.EMAIL_FAILED,
          details: emailResult.error,
        });
      }

      return res.status(200).json({ message: success.EMAIL_SENT });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({
      error: errors.EMAIL_FAILED,
      details: error.message,
    });
  }
}
