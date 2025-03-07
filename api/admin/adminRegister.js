import pool from "../utils/db.js";
import bcrypt from "bcrypt";
// Error messages in Arabic
const errors = {
  METHOD_NOT_ALLOWED: "Method not allowed",
  FIELDS_REQUIRED: "All fields are required",
  USER_EXISTS: "The email or phone number is already registered",
  REGISTRATION_FAILED: "Registration failed",
};

// Success message in Arabic
const success = {
  REGISTRATION_SUCCESS: "Registration successful",
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

  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: errors.FIELDS_REQUIRED });
  }

  try {
    const client = await pool.connect();

    try {
      // Check for existing admin
      const existingUser = await client.query(
        "SELECT * FROM users WHERE email = $1 ",
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: errors.USER_EXISTS });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new admin
      await client.query(
        `INSERT INTO users 
        (name, email, password, "isAdmin") 
        VALUES ($1, $2, $3, TRUE)`,
        [name, email, hashedPassword]
      );

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
