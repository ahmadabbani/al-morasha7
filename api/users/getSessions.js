// api/users/getSessions.js
import pool from "../utils/db.js";
import moment from "moment-timezone";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-User-Timezone" // Added X-User-Timezone here
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await pool.connect();
    try {
      // Get user bookings
      const userBookings = await client.query(`
            SELECT id,
              session_date::date as session_date,
              to_char(session_time, 'HH24:MI') as session_time,
              'user' as disabled_by
            FROM users 
            WHERE session_date IS NOT NULL 
            AND session_time IS NOT NULL
          `);

      // Get admin disabled dates
      const adminDisabled = await client.query(`
            SELECT id,
              disabled_date as session_date,
              to_char(disabled_time, 'HH24:MI') as session_time,
              'admin' as disabled_by
            FROM disabled_dates
          `);

      // Combine both results
      const allDisabledSlots = [...userBookings.rows, ...adminDisabled.rows];
      console.log(allDisabledSlots);
      return res.status(200).json(allDisabledSlots);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return res.status(500).json({ error: "Error fetching sessions" });
  }
}
