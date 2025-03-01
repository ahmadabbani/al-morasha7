import pool from "../utils/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailService.js";

// Error messages in Arabic
const errors = {
  METHOD_NOT_ALLOWED: "الطريقة غير مسموح بها",
  FIELDS_REQUIRED: "جميع الحقول مطلوبة",
  USER_EXISTS: "البريد الإلكتروني أو الهاتف موجود مسبقاً",
  REGISTRATION_FAILED: "فشل التسجيل",
  EMAIL_FAILED: "تم التسجيل ولكن فشل إرسال بريد التحقق",
};

// Success message in Arabic
const success = {
  REGISTRATION_SUCCESS:
    "تم التسجيل بنجاح، يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك",
};
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (or specify the exact frontend URL)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle preflight request
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: errors.METHOD_NOT_ALLOWED });
  }

  const { name, phone, email, district, role, password } = req.body;

  // Basic validation
  if (!name || !phone || !email || !district || !role || !password) {
    return res.status(400).json({ error: errors.FIELDS_REQUIRED });
  }

  try {
    const client = await pool.connect();

    try {
      // Check for existing user
      const existingUser = await client.query(
        "SELECT * FROM users WHERE email = $1 OR phone = $2",
        [email, phone]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: errors.USER_EXISTS });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Set token expiry time (24 hours from now)
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24);

      // Insert new user
      await client.query(
        `INSERT INTO users 
        (name, phone, email, district, role, password, session_date, session_time, verification_token, token_expiry, is_verified, email_verified_at) 
        VALUES ($1, $2, $3, $4, $5, $6, NULL, NULL, $7, $8, false, NULL)`,
        [
          name,
          phone,
          email,
          district,
          role,
          hashedPassword,
          verificationToken,
          tokenExpiry,
        ]
      );

      // Send verification email
      const emailResult = await sendVerificationEmail(
        email,
        name,
        verificationToken
      );

      if (!emailResult.success) {
        console.error("Failed to send verification email:", emailResult.error);
        return res.status(201).json({
          message: errors.EMAIL_FAILED,
          userId: emailResult.userId,
        });
      }

      return res.status(201).json({ message: success.REGISTRATION_SUCCESS });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      error: errors.REGISTRATION_FAILED,
      details: error.message,
    });
  }
}
