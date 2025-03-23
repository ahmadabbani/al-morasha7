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
      subject: "تأكيد بريدك/ي الإلكتروني",
      html: `
       <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; font-size: 18px;">
  <h2 style="font-size: 24px;">مرحباً ${name}،</h2>
  <p>شكراً لانضمامك/ي إلى برنامج <strong>المرشح/ة</strong>! يرجى النقر على الرابط أدناه لتأكيد بريدك/ي الإلكتروني:</p>
  <p>
    <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px; font-size: 18px;">
      تأكيد البريد الإلكتروني
    </a>
  </p>
  <p>إذا لم تكونوا قد انضممتم إلى البرنامج، يرجى تجاهل هذا البريد الإلكتروني.</p>
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

// Payment confirmation
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
            سنشارك معكم قريبًا تفاصيل إضافية حول جدول البرنامج والخطوات القادمة. لا تترددوا في التواصل معنا إذا كان لديكم أي استفسار.
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

// profile unlocked
export async function sendProfileConfirmationEmail(email, name) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Almourachah-Verification@almourachah.com", // Update with your sender domain
      to: email,
      subject:
        "Profile Unlocked - يمكنكم الآن الوصول إلى ملفكم الشخصي - Al Mourachah Team",
      html: `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <!-- English Section -->
  <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">Dear ${name},</p>
  <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">Greetings,</p>
  <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">
    Your profile has been successfully unlocked. You can now access your account and explore the available features.
  </p>
  <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">
    If the guide is available, you will now be able to access it as well.
  </p>
  <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">
    If you need any assistance, feel free to reach out to us.
  </p>
  <p style="font-size: 16px; line-height: 1.5; margin: 10px 0;">
    Best regards,<br>The Team
  </p>

  <!-- Separator -->
  <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">

  <!-- Arabic Section -->
  <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
    الموضوع: تم تفعيل حسابكم بنجاح
  </p>
  <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
    عزيزي/عزيزتي ${name}،  
  </p>
  <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
    تحية طيبة،
  </p>
  <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
    تم تفعيل حسابكم بنجاح، ويمكنكم الآن الاطلاع على المحتويات المتاحة في حسابكم.
  </p>
  <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
    إذا كان الدليل متاحًا، يمكنكم الآن الوصول إليه أيضًا.
  </p>
  <p style="font-size: 16px; line-height: 1.5; margin: 10px 0; direction: rtl; text-align: right;">
    في حال احتجكم إلى أي مساعدة، لا تترددوا في التواصل معنا.
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
    console.error("Error sending profile confirmation email:", error);
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
     A new user has booked an appointment through the Almourachah platform.
      Please review the details in the system and take the necessary action to confirm or reject the appointment.
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

export async function sendContactUsEmail(name, email, subject, message) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Almourachah-Contact@almourachah.com", // Adjust sender email as needed
      to: "info@almourachah.org",
      subject: `Contact Us: ${subject}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #202d61; text-align: center;">New Message from Almourachah Contact Form</h2>
          <p style="font-size: 16px; line-height: 1.5; margin: 15px 0;">
            You have received a new message from the "Contact Us" form:
          </p>
          <ul style="list-style: none; padding: 0; margin: 20px 0; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <li style="padding: 10px 15px; border-bottom: 1px solid #eee; font-size: 16px; line-height: 1.5;">
              <strong style="color: #202d61; width: 100px; display: inline-block;">Name:</strong> ${name}
            </li>
            <li style="padding: 10px 15px; border-bottom: 1px solid #eee; font-size: 16px; line-height: 1.5;">
              <strong style="color: #202d61; width: 100px; display: inline-block;">Email:</strong> ${email}
            </li>
            <li style="padding: 10px 15px; border-bottom: 1px solid #eee; font-size: 16px; line-height: 1.5;">
              <strong style="color: #202d61; width: 100px; display: inline-block;">Subject:</strong> ${subject}
            </li>
            <li style="padding: 10px 15px; font-size: 16px; line-height: 1.5;">
              <strong style="color: #202d61; width: 100px; display: inline-block;">Message:</strong> ${message}
            </li>
          </ul>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending contact us email:", error);
    return { success: false, error: error.message };
  }
}

export async function sendResetPasswordEmail(email, link) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Almourachah-Verification@almourachah.com",
      to: email,
      subject: "إعادة تعيين كلمة المرور",
      html: `
        <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; direction: rtl; text-align: right;">مرحبًا،</p>
<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; direction: rtl; text-align: right;">
  لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بكم. يرجى النقر على الرابط أدناه لتعيين كلمة مرور جديدة:
</p>
<p style="direction: rtl; text-align: right;">
   <a href="${link}" style="display: inline-block; font-family: Arial, sans-serif; font-size: 16px; color: #fff; background-color: #d42127; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
    إعادة تعيين كلمة المرور
  </a>
</p>
<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; direction: rtl; text-align: right;">
  إذا لم تكونوا قد طلبتم هذا، يمكنكم تجاهل البريد الإلكتروني.
</p>
<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; direction: rtl; text-align: right;">
  شكرًا،<br>
  <strong>فريق عمل برنامج المرشح/ة</strong>
</p>
      `,
    });
    if (error) {
      throw new Error(error.message);
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return { success: false, error: error.message };
  }
}
