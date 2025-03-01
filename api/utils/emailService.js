// utils/emailService.js
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, name, verificationToken) {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;

    const { data, error } = await resend.emails.send({
      from: "verification@almourachah.com", // Update with your sender domain configured in Resend
      to: email,
      subject: "تأكيد بريدك الإلكتروني",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>مرحباً ${name}،</h2>
          <p>شكراً للتسجيل في خدمتنا. يرجى النقر على الرابط أدناه لتأكيد بريدك الإلكتروني:</p>
          <p>
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">
              تأكيد البريد الإلكتروني
            </a>
          </p>
          <p>إذا لم تقم بالتسجيل في خدمتنا، يرجى تجاهل هذا البريد الإلكتروني.</p>
          <p>مع تحياتنا،<br>فريق الدعم</p>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error: error.message };
  }
}
