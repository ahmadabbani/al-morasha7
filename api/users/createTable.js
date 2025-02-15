import pool from "../utils/db.js";

export default async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "المستخدمين" (
        "المعرف" SERIAL PRIMARY KEY,
        "الاسم" VARCHAR(255) NOT NULL,
        "الهاتف" VARCHAR(20) UNIQUE NOT NULL,
        "البريد" VARCHAR(255) UNIQUE NOT NULL,
        "المنطقة" VARCHAR(100) NOT NULL,
        "الحالة" BOOLEAN DEFAULT TRUE,
        "تاريخ_التسجيل" DATE DEFAULT CURRENT_DATE,
        "تاريخ_الجلسة" DATE,
        "وقت_الجلسة" TIME
      )
    `);

    res.status(200).json({ message: "تم إنشاء الجدول بنجاح" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
