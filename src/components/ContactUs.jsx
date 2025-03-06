import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import "./ContactUs.css";
import { Mail, MessageSquare, PenSquare, Send, User } from "lucide-react";

const ContactUs = () => {
  const refContact = useRef(null);
  const inView6 = useInView(refContact, { once: true });

  return (
    <motion.section
      ref={refContact}
      initial={{ opacity: 0, y: 200 }}
      animate={inView6 ? { y: 0, opacity: 1 } : { y: 200, opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="contact-us container my-5"
      id="contact"
    >
      <h2 className="contact-title">تواصل معنا</h2>
      <form className="contact-form">
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
              placeholder="أدخل اسمك"
              required
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
              placeholder="أدخل بريدك الإلكتروني"
              required
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
            placeholder="أدخل موضوع رسالتك"
            required
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
            placeholder="اكتب رسالتك هنا..."
            rows="5"
            required
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
