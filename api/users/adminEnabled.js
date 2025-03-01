// api/users/adminDisabled.js
import pool from "../utils/db.js";
import moment from "moment-timezone";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-User-Timezone"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { date, time } = req.body;
  try {
    const client = await pool.connect();
    try {
      await client.query(
        "DELETE FROM disabled_dates WHERE disabled_date = $1::date AND disabled_time = $2::time",
        [date, time]
      );

      // If it was a user booking, clear it from users table
      if (req.query.isUserBooking === "true") {
        await client.query(
          "UPDATE users SET session_date = NULL, session_time = NULL, status = false WHERE session_date = $1::date AND session_time = $2::time",
          [date, time]
        );
      }

      res.status(200).json({ message: "Date enabled successfully" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error enabling date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
