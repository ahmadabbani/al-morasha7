import pool from "../utils/db.js";

const allowedOrigins = [
  "http://localhost:5173",
  // Add production domain here, e.g., "https://your-app.vercel.app"
];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "الطريقة غير مسموح بها" });
  }

  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM blogs ORDER BY id DESC"); // Fetch all blogs, ordered by most recent
    client.release();

    res.status(200).json(result.rows); // Return the array of blog objects
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب المدونات" });
  }
}
