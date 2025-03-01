import pool from "../utils/db.js";
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
const allowedOrigins = [
  "http://localhost:5173",
  // Add production domain
];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "الطريقة غير مسموح بها" });
  }

  const form = formidable({ multiples: false }); // Single file upload

  try {
    const [fields, files] = await form.parse(req);

    const { title, description } = fields;
    const image = files.image?.[0]; // formidable returns an array for each field

    if (!title?.[0] || !description?.[0] || !image) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة" });
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image.filepath, {
      folder: "blogs", // Optional: organize images in a 'blogs' folder in Cloudinary
      public_id: `${Date.now()}-${image.originalFilename.split(".")[0]}`, // Unique name
    });

    const imageUrl = uploadResult.secure_url; // Get the secure URL from Cloudinary

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
}
export const config = {
  api: {
    bodyParser: false, // Disable Vercel's default body parser for multipart data
  },
};
