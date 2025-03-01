// api/users/logout.js
import { serialize } from "cookie";
// Allowed origins (update with your domains)
const allowedOrigins = [
  "http://localhost:5173", // Local development
  // Production
];
export default async function handler(req, res) {
  //remove when deploy as both frontend and back are on vercel same domain (not interact also with railway db)
  // Set CORS headers dynamically
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // Clear the token cookie
  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0), // Set expiration to a past date
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  );

  return res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
}
