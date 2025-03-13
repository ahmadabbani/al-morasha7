// utils/emailService.js
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, name, verificationToken) {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;

    const { data, error } = await resend.emails.send({
      from: "Almourachah-Verification@almourachah.com", // Update with your sender domain configured in Resend
      to: email,
      subject: "تأكيد بريدك الإلكتروني",
      html: `
       <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; font-size: 18px;">
  <h2 style="font-size: 24px;">مرحباً ${name}،</h2>
  <p>شكراً لانضمامك إلى برنامج <strong>المرشح/ة</strong>! يرجى النقر على الرابط أدناه لتأكيد بريدك الإلكتروني:</p>
  <p>
    <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px; font-size: 18px;">
      تأكيد البريد الإلكتروني
    </a>
  </p>
  <p>إذا لم تكن قد انضممت إلى البرنامج، يرجى تجاهل هذا البريد الإلكتروني.</p>
  <p>مع أطيب التحيات،<br>فريق الدعم</p>
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

// New function
export async function sendPaymentConfirmationEmail(email, name) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Almourachah-Verification@almourachah.com", // Update with your sender domain
      to: email,
      subject:
        "Confirmation of Your Registration – Al Mourachah Coaching Program",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <!-- English Section -->
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">Dear ${name},</p>
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">Greetings,</p>
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">
            Thank you for registering for the Al Mourachah Coaching Program and completing your down payment. 
            Your participation is now confirmed, and we are excited to seeing you with us on this journey.
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">
            Further details regarding the program schedule and next steps will be shared with you soon.
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">
            If you have any questions, feel free to reach out to the team on any platform.
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">
            Looking forward to working together!
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">
            Best regards,<br>Al Mourachah Team
          </p>

          <!-- Separator -->
          <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">

          <!-- Arabic Section -->
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
            الموضوع: تأكيد تسجيلكم – برنامج المرشح/ة للتدريب
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
            المرشح/ة المحترم/ة،
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
            تحيّة،
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
            شكرًا لتسجيلكم في برنامج المترشح للتدريب والتأهيل وإتمام الدفعة الأولى.
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
            لقد تم تأكيد مشاركتكم، ونتطلع للانطلاق معك في هذه الرحلة المميزة.
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
            سنشارك معكم قريبًا تفاصيل إضافية حول جدول البرنامج والخطوات القادمة. لا تتردد في التواصل معنا إذا كان لديكم أي استفسار.
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
            بانتظار لقائنا قريبًا!
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
            أطيب التحيات،<br>فريق عمل برنامج المرشح/ة
          </p>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending payment confirmation email:", error);
    return { success: false, error: error.message };
  }
}

//appointemrnt notification
export async function sendNewAppointmentEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: "Almourachah-Notification@almourachah.com", // Update sender email
      to: "info@almourachah.org",
      subject: "New Appointment from Almourachah",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #202d61; text-align: center;">New Appointment Notification</h2>
          <p style="font-size: 16px; line-height: 1.5; margin: 15px 0;">
            A new user has booked an appointment through the Almourachah platform. Please review the details in the system.
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 15px 0;">
            For further information, please check the admin panel.
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 15px 0;">
            Best regards,<br>Almourachah Team
          </p>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending appointment notification email:", error);
    return { success: false, error: error.message };
  }
}
