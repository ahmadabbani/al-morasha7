import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import "./Footer.css"; // Separate CSS file

const Footer = () => {
  return (
    <footer className="footer-container">
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
                  من نحن
                </ScrollLink>
              </li>
              <li>
                <ScrollLink
                  to="contact"
                  offset={-70}
                  smooth={true}
                  duration={0}
                  className="footer-link"
                >
                  التسجيل
                </ScrollLink>
              </li>
            </ul>
          </div>

          {/* Right - Call to Action + Social Icons */}
          <div className="col-md-3 col-12 footer-cta-section">
            <div className="footer-cta-wrapper">
              <p className="footer-cta-text">
                لا تفوّت فرصة الحصول على الدليل الذي تحتاجه لمعلومات كاملة حول
                حملتك الانتخابية وخطوات الترشّح بنجاح!
              </p>
              <button className="footer-register-btn">سجل الآن!</button>
            </div>
            <div className="footer-social-icons">
              <a href="#" className="footer-social-link">
                <FaInstagram className="footer-icon" />
              </a>
              <a href="#" className="footer-social-link">
                <FaTwitter className="footer-icon" />
              </a>
              <a href="#" className="footer-social-link">
                <FaFacebook className="footer-icon" />
              </a>
              <a href="#" className="footer-social-link">
                <FaTiktok className="footer-icon" />
              </a>
              <a href="#" className="footer-social-link">
                <FaWhatsapp className="footer-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
