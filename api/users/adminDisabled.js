// api/users/adminDisabled.js
import pool from "../utils/db.js";
import dayjs from "dayjs";
import moment from "moment-timezone";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-User-Timezone"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { date, time } = req.body;

  try {
    const client = await pool.connect();
    try {
      // If the time contains a range indicator (" - "), treat it as a full-day selection
      if (time.includes(" - ")) {
        // Insert only the date into the disabled_days table
        const queryText = `
          INSERT INTO disabled_days (disabled_day)
          VALUES ($1::date)
          ON CONFLICT DO NOTHING`; // Optional: Prevents duplicate entries if disabled_day is unique
        await client.query(queryText, [date]);
      } else {
        // For a single 15-minute slot, insert it normally into disabled_dates
        await client.query(
          "INSERT INTO disabled_dates (disabled_date, disabled_time) VALUES ($1::date, $2::time)",
          [date, time]
        );
      }
      res.status(200).json({ message: "Date disabled successfully" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error disabling date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
