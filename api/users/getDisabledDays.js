// api/users/getDisabledDays.js
import pool from "../utils/db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-User-Timezone"
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
      // Query distinct fully disabled days from the table.
      const queryText = `
      SELECT DISTINCT TO_CHAR(disabled_day, 'YYYY-MM-DD') AS disabled_day 
      FROM disabled_days 
      WHERE disabled_day IS NOT NULL
    `;
      const result = await client.query(queryText);
      // Return an array of disabled days in "YYYY-MM-DD" format.
      res.status(200).json(result.rows.map((row) => row.disabled_day));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching disabled days:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
