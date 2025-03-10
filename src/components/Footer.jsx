import { React, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaTiktok,
  FaWhatsapp,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { motion, useInView } from "framer-motion";

import { Link as ScrollLink } from "react-scroll";
import "./Footer.css"; // Separate CSS file

const Footer = () => {
  const refFooter = useRef(null);
  const inView7 = useInView(refFooter, { once: true });

  return (
    <motion.footer
      ref={refFooter}
      initial={{ y: 100, opacity: 0 }}
      animate={inView7 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="footer-container"
    >
      <div className="container">
        <div className="row align-items-center">
          {/* Left - Logo */}
          <div className="col-md-3 col-12 footer-logo-section">
            <Link to="/">
              <img
                src="/images/header-logo-white.png"
                alt="Logo"
                className="footer-logo"
              />
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="col-md-6 col-12 footer-nav">
            <ul className="footer-links">
              <li>
                <ScrollLink
                  to="home"
                  smooth={true}
                  duration={0}
                  offset={-70}
                  className="footer-link"
                >
                  الرئيسية
                </ScrollLink>
              </li>
              <li>
                <ScrollLink
                  to="about"
                  offset={-70}
                  smooth={true}
                  duration={0}
                  className="footer-link"
                >
                  عن البرنامج
                </ScrollLink>
              </li>
              <li>
                <Link
                  to="/register"
                  offset={-70}
                  smooth={true}
                  duration={0}
                  className="footer-link footer-register"
                >
                  تسجيل جديد
                </Link>
              </li>
            </ul>
          </div>

          {/* Right - Call to Action + Social Icons */}
          <div className="col-md-3 col-12 footer-cta-section">
            <div className="footer-cta-wrapper">
              <p className="footer-cta-text">
                لا تفوّتوا فرصة الحصول على الدليل الذي تحتاجونه لمعلومات كاملة
                حول حملتكم الانتخابية وخطوات الترشّح بنجاح!
              </p>
              <Link to="/register">
                <button className="footer-register-btn"> سجل/ي الآن !</button>
              </Link>
            </div>
            <div className="footer-social-icons">
              <a
                href="https://www.tiktok.com/@almourachah?_t=ZS-8uU6DWUwyBd&_r=1"
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok className="footer-icon" />
              </a>
              <a
                href="https://www.instagram.com/al_mourachah?igsh=eGd1N3h3eWtmdnN4&utm_source=qr"
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="footer-icon" />
              </a>
              {/* <a href="#" className="footer-social-link" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="footer-icon" />
              </a> */}
              <a
                href="https://www.facebook.com/share/163jj6EvGE/?mibextid=wwXIfr"
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="footer-icon" />
              </a>
              <a
                href="https://www.youtube.com/@%D8%A7%D9%84%D9%85%D8%B1%D8%B4%D9%91%D8%AD-%D8%A9"
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube className="footer-icon" />
              </a>

              <a
                href="https://wa.me/96171346435"
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="footer-icon" />
              </a>
              <a
                href="https://www.linkedin.com/company/almourachah-%D8%A7%D9%84%D9%85%D8%B1%D8%B4%D9%91%D8%AD/"
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="footer-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
