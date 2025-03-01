// api/users/bookSession.js
import pool from "../utils/db.js";
import moment from "moment-timezone";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-User-Timezone" // Added X-User-Timezone here
  );
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, sessionDate, sessionTime } = req.body;
  const userTimezone = req.headers["x-user-timezone"] || "Asia/Beirut"; // Default to Beirut if not specified

  if (!userId || !sessionDate || !sessionTime) {
    return res.status(400).json({ error: "جميع الحقول مطلوبة" });
  }

  try {
    const client = await pool.connect();

    try {
      const timeFormatted = sessionTime + ":00"; // Add seconds to match TIME format

      // Check if slot is already booked
      const existingBooking = await client.query(
        "SELECT id FROM users WHERE session_date = $1::date AND session_time = $2::time",
        [sessionDate, timeFormatted]
      );

      if (existingBooking.rows.length > 0) {
        return res.status(409).json({ error: "هذا الموعد محجوز مسبقاً" });
      }

      // Book the slot with proper type casting
      await client.query(
        "UPDATE users SET session_date = $1::date, session_time = $2::time, status = false WHERE id = $3",
        [sessionDate, timeFormatted, userId]
      );

      return res.status(200).json({ message: "تم حجز الموعد بنجاح" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error booking session:", error);
    return res.status(500).json({ error: "حدث خطأ أثناء حجز الموعد" });
  }
}
