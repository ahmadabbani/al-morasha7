import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-User-Timezone"
  );

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Path to PDF file - relative to the project root
    const filePath = path.join(process.cwd(), "private-assets", "guide.pdf");

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
  }
}
