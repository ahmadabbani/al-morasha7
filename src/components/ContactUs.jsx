import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import "./ContactUs.css";
import { Mail, MessageSquare, PenSquare, Send, User } from "lucide-react";
import { toast } from "react-toastify";

const ContactUs = () => {
  const refContact = useRef(null);
  const inView6 = useInView(refContact, { once: true });
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const subject = e.target.subject.value;
    const message = e.target.message.value;
    if (!name || !email || !subject || !message) {
      toast.warning("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/auth/send-contact-us`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, subject, message }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("!تم إرسال الرسالة بنجاح"); // Or use alert("Message sent successfully!");
        e.target.reset(); // Clear the form
      } else {
        toast.error("فشل إرسال الرسالة. حاول مرة أخرى."); // Or use alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("حدث خطأ. حاول مرة أخرى."); // Or use alert("An error occurred.");
    }
  };
  return (
    <motion.section
      ref={refContact}
      initial={{ opacity: 0, y: 200 }}
      animate={inView6 ? { y: 0, opacity: 1 } : { y: 200, opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="contact-us container my-5"
      id="contact"
    >
      <h2 className="contact-title">تواصلوا معنا</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="row">
          {/* Name Field */}
          <div className="col-md-6 mb-4">
            <label htmlFor="name" className="form-label">
              <User className="icon" size={20} color="#202d61" />
              الاسم
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="الاسم"
            />
          </div>

          {/* Email Field */}
          <div className="col-md-6 mb-4">
            <label htmlFor="email" className="form-label">
              <Mail className="icon" size={20} color="#202d61" />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="البريد الإلكتروني"
            />
          </div>
        </div>

        {/* Subject Field */}
        <div className="mb-4">
          <label htmlFor="subject" className="form-label">
            <MessageSquare className="icon" size={20} color="#202d61" />
            الموضوع
          </label>
          <input
            type="text"
            id="subject"
            className="form-input"
            placeholder="موضوع الرسالة"
          />
        </div>

        {/* Message Field */}
        <div className="mb-4">
          <label htmlFor="message" className="form-label">
            <PenSquare className="icon" size={20} color="#202d61" />
            الرسالة
          </label>
          <textarea
            id="message"
            className="form-textarea"
            placeholder=" الرسالة..."
            rows="5"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className="contactus-submit-btn">
          <Send className="icon" size={20} />
          إرسال
        </button>
      </form>
    </motion.section>
  );
};

export default ContactUs;
