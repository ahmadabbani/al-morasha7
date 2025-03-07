import pool from "../../utils/db.js"; // Adjusted path: two levels up from adminAction/
import { requireAdmin } from "../../utils/auth.js"; // Adjusted path
import dotenv from "dotenv";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

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
];

export default async function handler(req, res) {
  // Set CORS headers dynamically
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    return res.status(403).json({ error: "Origin not allowed" });
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight (OPTIONS) request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const endpoint = req.query.endpoint;

  // Handle GET requests
  if (req.method === "GET") {
    if (endpoint === "acceptSession") {
      // --- acceptSession GET Logic ---
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
    } else if (endpoint === "blogs") {
      // --- blogs Logic ---
      try {
        const client = await pool.connect();
        const result = await client.query(
          "SELECT * FROM blogs ORDER BY id DESC"
        );
        client.release();

        res.status(200).json(result.rows);
      } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب المدونات" });
      }
    } else {
      return res.status(404).json({ error: "Endpoint not found" });
    }
  }

  // Handle POST requests
  if (req.method === "POST") {
    if (endpoint === "createBlog") {
      // --- createBlog Logic ---
      const form = formidable({ multiples: false });

      try {
        const [fields, files] = await form.parse(req);

        const { title, description } = fields;
        const image = files.image?.[0];

        if (!title?.[0] || !description?.[0] || !image) {
          return res.status(400).json({ error: "جميع الحقول مطلوبة" });
        }

        const uploadResult = await cloudinary.uploader.upload(image.filepath, {
          folder: "blogs",
          public_id: `${Date.now()}-${image.originalFilename.split(".")[0]}`,
        });

        const imageUrl = uploadResult.secure_url;

        const client = await pool.connect();
        const result = await client.query(
          "INSERT INTO blogs (title, description, image_url) VALUES ($1, $2, $3) RETURNING *",
          [title[0], description[0], imageUrl]
        );
        client.release();

        res
          .status(201)
          .json({ message: "تم إنشاء المدونة بنجاح", blog: result.rows[0] });
      } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "حدث خطأ أثناء إنشاء المدونة" });
      }
    } else {
      return res.status(404).json({ error: "Endpoint not found" });
    }
  }

  // Handle PUT requests
  if (req.method === "PUT") {
    if (endpoint === "acceptSession") {
      // --- acceptSession PUT Logic ---
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
    } else if (endpoint === "isPayed") {
      // --- isPayed Logic ---
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

      const { userId } = req.body;

      try {
        const client = await pool.connect();
        try {
          await client.query(
            'UPDATE users SET "isPayed" = TRUE WHERE id = $1',
            [userId]
          );

          return res
            .status(200)
            .json({ message: "contents unlocked successfully" });
        } finally {
          client.release();
        }
      } catch (error) {
        console.error("Error unlocking contents:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } else if (endpoint === "rejectSession") {
      // --- rejectSession Logic ---
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

      const { userId } = req.body;

      try {
        const client = await pool.connect();
        try {
          await client.query(
            "UPDATE users SET session_date = NULL, session_time = NULL, status = false WHERE id = $1",
            [userId]
          );

          return res
            .status(200)
            .json({ message: "Session status updated successfully" });
        } finally {
          client.release();
        }
      } catch (error) {
        console.error("Error updating Session status:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } else {
      return res.status(404).json({ error: "Endpoint not found" });
    }
  }

  // Fallback for unsupported methods
  return res.status(405).json({ error: "Method not allowed" });
}

// Config for multipart/form-data (from createBlog)
export const config = {
  api: {
    bodyParser: false, // Disable Vercel's default body parser for multipart data
  },
};
