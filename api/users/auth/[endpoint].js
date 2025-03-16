import pool from "../../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import dotenv from "dotenv";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendContactUsEmail,
} from "../../utils/emailService.js";

dotenv.config();

// Unified allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://al-morasha7.vercel.app", // Production frontend URL
  "https://almourachah.org",
];

// Error and success messages
const errors = {
  METHOD_NOT_ALLOWED: "الطريقة غير مسموح بها",
  FIELDS_REQUIRED: "جميع الحقول مطلوبة",
  USER_EXISTS: "البريد الإلكتروني أو الهاتف موجود مسبقاً",
  REGISTRATION_FAILED: "فشل التسجيل",
  EMAIL_FAILED: "تم التسجيل ولكن فشل إرسال بريد التحقق",
  EMAIL_REQUIRED: "البريد الإلكتروني مطلوب",
  USER_NOT_FOUND: "لم يتم العثور على المستخدم",
  ALREADY_VERIFIED: "تم التحقق من البريد الإلكتروني بالفعل",
  TOKEN_REQUIRED: "رمز التحقق مطلوب",
  TOKEN_INVALID: "رمز التحقق غير صالح أو منتهي الصلاحية",
  VERIFICATION_FAILED: "فشل التحقق من البريد الإلكتروني",
};

const success = {
  REGISTRATION_SUCCESS:
    "تم التسجيل بنجاح، يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك",
  EMAIL_SENT: "تم إرسال رابط التحقق، يرجى التحقق من بريدك الإلكتروني",
  VERIFICATION_SUCCESS: "تم التحقق من البريد الإلكتروني بنجاح",
};

export default async function handler(req, res) {
  const origin = req.headers.origin;
  const host = req.headers.host; // e.g., "almourachah.org"
  const isProduction = process.env.NODE_ENV === "production";
  const expectedHost = isProduction ? "almourachah.org" : "localhost:3000";

  if (!origin && host === expectedHost) {
    res.setHeader("Access-Control-Allow-Origin", `https://${host}`);
  } else if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    console.log("Rejected origin:", origin, "Host:", host);
    return res.status(403).json({ error: "Origin not allowed" });
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // STEP 3: Now handle the actual endpoints by HTTP method and dynamic endpoint

  // Handle POST requests
  if (req.method === "POST") {
    const endpoint = req.query.endpoint;

    if (endpoint === "login") {
      // --- Login Logic ---
      const { emailOrPhone, password } = req.body;

      // Basic validation
      if (!emailOrPhone || !password) {
        return res.status(400).json({ error: errors.FIELDS_REQUIRED });
      }

      try {
        const client = await pool.connect();

        try {
          // Find user by email or phone
          const user = await client.query(
            `SELECT id, name, email, password, phone, status, district, region, role, "isAdmin", "isPayed", is_verified,
             session_date::date as session_date,
             to_char(session_time, 'HH24:MI') as session_time 
           FROM users WHERE email = $1 OR phone = $1`,
            [emailOrPhone]
          );

          if (user.rows.length === 0) {
            return res
              .status(404)
              .json({ error: "البريد الإلكتروني أو الهاتف غير موجود" });
          }

          // Check if email is verified
          if (!user.rows[0].is_verified) {
            return res.status(403).json({
              error:
                "لم يتم التحقق من بريدك الإلكتروني، يرجى التحقق من بريدك الإلكتروني وانقر على رابط التحقق",
              needsVerification: true,
              userId: user.rows[0].id,
            });
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
              status: user.rows[0].status,
            },
            process.env.JWT_SECRET,
            { expiresIn: "4h" }
          );

          // Set JWT in HTTP-only cookie
          res.setHeader(
            "Set-Cookie",
            serialize("token", token, {
              httpOnly: true,
              path: "/",
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
              maxAge: 8 * 3600,
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
              region: user.rows[0].region,
              role: user.rows[0].role,
              session_date: user.rows[0].session_date,
              session_time: user.rows[0].session_time,
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
    } else if (endpoint === "register") {
      // --- Register Logic ---
      const { name, phone, email, district, region, role, password } = req.body;

      // Basic validation
      if (
        !name ||
        !phone ||
        !email ||
        !district ||
        !region ||
        !role ||
        !password
      ) {
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
            (name, phone, email, district, region, role, password, session_date, session_time, verification_token, token_expiry, is_verified, email_verified_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, NULL, $8, $9, false, NULL)`,
            [
              name,
              phone,
              email,
              district,
              region,
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
            console.error(
              "Failed to send verification email:",
              emailResult.error
            );
            return res.status(201).json({
              message: errors.EMAIL_FAILED,
              userId: emailResult.userId,
            });
          }

          return res
            .status(201)
            .json({ message: success.REGISTRATION_SUCCESS });
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
    } else if (endpoint === "send-contact-us") {
      const { name, email, subject, message } = req.body;
      try {
        const result = await sendContactUsEmail(name, email, subject, message);
        if (result.success) {
          return res.status(200).json({ success: true });
        } else {
          return res.status(500).json({ success: false, error: result.error });
        }
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    } else if (endpoint === "logout") {
      // --- Logout Logic ---
      // Clear the token cookie
      res.setHeader(
        "Set-Cookie",
        serialize("token", "", {
          httpOnly: true,
          path: "/",
          expires: new Date(0),
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        })
      );

      return res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
    } else if (endpoint === "resend-verification") {
      // --- Resend Verification Logic ---
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
    } else {
      return res.status(404).json({ error: "Endpoint not found" });
    }
  }

  // Handle GET requests
  if (req.method === "GET") {
    const endpoint = req.query.endpoint;

    if (endpoint === "me") {
      // --- Me Logic ---
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ error: "غير مصرح به" });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from DB
        const user = await pool.query(
          `SELECT id, name, email, phone, status, district, region, role, "isAdmin", "isPayed", session_date::date as session_date,
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
    } else {
      return res.status(404).json({ error: "Endpoint not found" });
    }
  }

  // Handle PUT requests
  if (req.method === "PUT") {
    const endpoint = req.query.endpoint;

    if (endpoint === "verify") {
      // --- Verify Logic ---
      const token = req.query.token; // Note: this assumes token is passed as a query param (e.g., /auth/verify?token=xyz)

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
          return res
            .status(200)
            .json({ message: success.VERIFICATION_SUCCESS });
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
    } else {
      return res.status(404).json({ error: "Endpoint not found" });
    }
  }

  // Fallback for unsupported methods
  return res.status(405).json({ error: errors.METHOD_NOT_ALLOWED });
}
