import pool from "../../utils/db.js"; // Adjusted path: two levels up from adminAction/
import { requireAdmin } from "../../utils/auth.js"; // Adjusted path
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import {
  sendPaymentConfirmationEmail,
  sendProfileConfirmationEmail,
} from "../../utils/emailService.js";

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Unified allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://al-morasha7.vercel.app", // Production frontend URL
  "https://almourachah.org",
  "https://almourachah.com",
];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  const host = req.headers.host; // e.g., "almourach.org" or "almourach.com"
  const isProduction = process.env.NODE_ENV === "production";
  const allowedHosts = isProduction
    ? ["almourachah.org", "almourachah.com"]
    : ["localhost:3000"];

  if (!origin && allowedHosts.includes(host)) {
    res.setHeader("Access-Control-Allow-Origin", `https://${host}`);
  } else if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    console.log("Rejected origin:", origin, "Host:", host);
    return res.status(403).json({ error: "Origin not allowed" });
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const endpoint = req.query.endpoint;

  try {
    // **GET Requests**
    if (req.method === "GET") {
      if (endpoint === "acceptSession") {
        // --- acceptSession GET Logic ---
        // Validate admin access
        const client = await pool.connect();
        try {
          const users = await client.query(`
            SELECT 
              id,
              name,
              phone,
              email,
              district,
              region,
              role,
              contact,
              status,
              "isPayed",
              "isConfirmed",
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
      } else if (endpoint === "blogs") {
        // --- blogs GET Logic ---
        const client = await pool.connect();
        try {
          const result = await client.query(
            "SELECT * FROM blogs ORDER BY id DESC"
          );
          return res.status(200).json(result.rows);
        } finally {
          client.release();
        }
      } else if (endpoint === "singleBlog") {
        // --- singleBlog GET Logic ---
        const blogId = req.query.id; // Get id from query params
        const client = await pool.connect();
        try {
          const result = await client.query(
            "SELECT * FROM blogs WHERE id = $1",
            [blogId]
          );
          if (result.rows.length === 0) {
            return res.status(404).json({ error: "Blog not found" });
          }
          return res.status(200).json(result.rows[0]);
        } finally {
          client.release();
        }
      } else if (endpoint === "serveGuide") {
        const token = req.cookies.token;
        if (!token) {
          return res.redirect("/");
        }
        const client = await pool.connect();
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await client.query(
            `SELECT id, "isPayed", "isConfirmed" FROM users WHERE id = $1`,
            [decoded.id]
          );

          if (
            user.rows.length === 0 ||
            !user.rows[0].isPayed ||
            !user.rows[0].isConfirmed
          ) {
            return res.redirect("/");
          }
          // Path to PDF file - relative to the project root
          const filePath = path.join(
            process.cwd(),
            "private-assets",
            "guide.pdf"
          );

          // Check if file exists
          if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
          }

          // Read the file as a stream to handle larger files efficiently
          const stream = fs.createReadStream(filePath);

          // Set headers for inline PDF viewing (not downloadable)
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", 'inline; filename="guide.pdf"');
          res.setHeader(
            "Cache-Control",
            "no-store, no-cache, must-revalidate, proxy-revalidate"
          );
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");

          // Stream the PDF to the response
          stream.pipe(res);
        } catch (error) {
          console.error("Error serving PDF:", error);
          res.status(500).json({ error: "Internal server error" });
        } finally {
          client.release(); // always release connection
        }
      } else {
        return res.status(404).json({ error: "Endpoint not found" });
      }
    }
    // **POST Requests**
    else if (req.method === "POST") {
      if (endpoint === "createBlog") {
        // --- createBlog POST Logic ---
        // Validate admin access
        const form = formidable({ multiples: false });
        const [fields, files] = await form.parse(req);
        const { title, description, link } = fields;
        const image = files.image?.[0];

        if (!title?.[0] || !description?.[0] || !link?.[0] || !image) {
          return res.status(400).json({ error: "All fields are required" });
        }

        const uploadResult = await cloudinary.uploader.upload(image.filepath, {
          folder: "blogs",
          public_id: `${Date.now()}-${image.originalFilename.split(".")[0]}`,
        });
        const imageUrl = uploadResult.secure_url;

        const client = await pool.connect();
        try {
          const result = await client.query(
            "INSERT INTO blogs (title, description, link, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
            [title[0], description[0], link[0], imageUrl]
          );
          return res.status(201).json({
            message: "The blog was successfully created",
            blog: result.rows[0],
          });
        } finally {
          client.release();
        }
      } else {
        return res.status(404).json({ error: "Endpoint not found" });
      }
    }
    // **PUT Requests**
    else if (req.method === "PUT") {
      if (endpoint === "acceptSession") {
        // --- acceptSession PUT Logic ---
        // Validate admin access
        const { userId } = req.body;
        const client = await pool.connect();
        try {
          await client.query("UPDATE users SET status = true WHERE id = $1", [
            userId,
          ]);
          return res
            .status(200)
            .json({ message: "Date status updated successfully" });
        } finally {
          client.release();
        }
      } else if (endpoint === "isPayed") {
        // --- isPayed PUT Logic ---
        // Validate admin access
        const { userId } = req.body;
        const client = await pool.connect();
        try {
          await client.query(
            'UPDATE users SET "isPayed" = TRUE WHERE id = $1',
            [userId]
          );
          // Fetch user’s email and name from database
          const userResult = await client.query(
            "SELECT email, name FROM users WHERE id = $1",
            [userId]
          );
          if (userResult.rows.length === 0) {
            throw new Error("User not found");
          }
          const { email, name } = userResult.rows[0];

          // Send payment confirmation email
          const emailResult = await sendPaymentConfirmationEmail(email, name);
          if (!emailResult.success) {
            console.error(
              "Failed to send payment confirmation email:",
              emailResult.error
            );
            // Log error but proceed, as email sending isn’t critical
          }

          return res
            .status(200)
            .json({ message: "Contents unlocked successfully" });
        } catch (error) {
          console.error("Error in isPayed endpoint:", error);
          return res.status(500).json({ error: "Internal server error" });
        } finally {
          client.release();
        }
      } else if (endpoint === "isConfirmed") {
        // --- isConfirmed PUT Logic to unlock profile ---
        // Validate admin access
        const { userId } = req.body;
        const client = await pool.connect();
        try {
          await client.query(
            'UPDATE users SET "isConfirmed" = TRUE WHERE id = $1',
            [userId]
          );
          // Fetch user’s email and name from database
          const userResult = await client.query(
            "SELECT email, name FROM users WHERE id = $1",
            [userId]
          );
          if (userResult.rows.length === 0) {
            throw new Error("User not found");
          }
          const { email, name } = userResult.rows[0];

          // Send confirmation email
          const emailResult = await sendProfileConfirmationEmail(email, name);
          if (!emailResult.success) {
            console.error(
              "Failed to send profile confirmation email:",
              emailResult.error
            );
            // Log error but proceed, as email sending isn’t critical
          }

          return res
            .status(200)
            .json({ message: "Profile unlocked successfully" });
        } catch (error) {
          console.error("Error in isConfirmed endpoint:", error);
          return res.status(500).json({ error: "Internal server error" });
        } finally {
          client.release();
        }
      } else if (endpoint === "rejectSession") {
        // --- rejectSession PUT Logic ---
        // Validate admin access
        const { userId } = req.body;
        const client = await pool.connect();
        try {
          await client.query(
            "UPDATE users SET session_date = NULL, session_time = NULL, status = false WHERE id = $1",
            [userId]
          );
          return res
            .status(200)
            .json({ message: "Date status updated successfully" });
        } finally {
          client.release();
        }
      } else {
        return res.status(404).json({ error: "Endpoint not found" });
      }
    }
    // **Fallback for Unsupported Methods**
    else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in handler:", error);
    if (error.message === "Unauthorized") {
      return res.status(401).json({ error: "Unauthorized" });
    } else if (error.message === "Forbidden") {
      return res.status(403).json({ error: "Forbidden" });
    } else if (!res.headersSent) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

// Config for multipart/form-data (for createBlog endpoint)
export const config = {
  api: {
    bodyParser: false, // Disable Vercel's default body parser for multipart data
  },
};
