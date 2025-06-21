import {
  Link as LinkToExternal,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../components/AuthContext";
import { toast } from "react-toastify";
import "./Header.css";
import { useEffect, useState } from "react";

const Header = () => {
  const { user, loading, setUser } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isAuthPage =
    [
      "/login",
      "/register",
      "/profile",
      "/reset-password-request",
      "/reset-password",
      "/verify",
      "/resend-verification",
    ].includes(location.pathname) || location.pathname.startsWith("/blog/");
  const isHome = location.pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (res.ok) {
        setUser(null);
        toast.success("تم تسجيل الخروج بنجاح");
        navigate("/login");
      } else {
        throw new Error("فشل تسجيل الخروج");
      }
    } catch (error) {
      toast.error(error.message || "حدث خطأ أثناء تسجيل الخروج");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "linear" }}
      className={`header-container ${scrolled ? "header-scrolled" : ""} ${
        !isHome ? "header-not-home" : ""
      }`}
    >
      <nav className="header-nav">
        <LinkToExternal to="/" className="header-logo-container">
          <img
            src={
              !isHome
                ? "/images/header-logo.png"
                : scrolled
                ? "/images/header-logo.png"
                : "/images/header-logo-white.png"
            }
            alt="Logo"
            className="header-logo"
          />
        </LinkToExternal>
        {/* Hamburger Icon */}
        <button className="header-hamburger" onClick={toggleMenu}>
          <FaBars />
        </button>
        {/* Always visible links */}
        <div
          className={`header-nav-links ${
            isMenuOpen ? "header-nav-links-open" : ""
          }`}
        >
          {isHome ? (
            <ScrollLink
              to="home"
              smooth={true}
              duration={0}
              offset={-70}
              className="header-nav-link"
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            >
              الرئيسية
            </ScrollLink>
          ) : (
            <LinkToExternal
              to="/"
              className="header-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              الرئيسية
            </LinkToExternal>
          )}
          {/* Conditionally visible links */}
          {!isAuthPage && (
            <>
              <ScrollLink
                to="about"
                offset={-70}
                smooth={true}
                duration={0}
                className="header-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                عن البرنامج
              </ScrollLink>
              <ScrollLink
                to="whoweare"
                offset={-70}
                smooth={true}
                duration={0}
                className="header-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                من نحن
              </ScrollLink>
              <ScrollLink
                to="leaders-guide"
                offset={-70}
                smooth={true}
                duration={0}
                className="header-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                قادة البلديات
              </ScrollLink>
              <ScrollLink
                to="blogs"
                offset={-70}
                smooth={true}
                duration={0}
                className="header-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                المدوّنات
              </ScrollLink>
              <ScrollLink
                to="contact"
                offset={-70}
                smooth={true}
                duration={0}
                className="header-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                تواصلوا معنا
              </ScrollLink>
            </>
          )}
          {user && !user.isAdmin && user.isConfirmed && (
            <LinkToExternal
              to="/profile"
              className="header-nav-link header-nav-profile"
              onClick={() => setIsMenuOpen(false)}
            >
              حسابي
            </LinkToExternal>
          )}

          <LinkToExternal
            to="/register"
            className="header-nav-link header-nav-register"
            onClick={() => setIsMenuOpen(false)}
          >
            تسجيل جديد
          </LinkToExternal>

          {/* Conditional links */}
          {!loading && (
            <div className="header-auth-links">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="header-nav-link header-logout-button"
                    disabled={isLoading} // Disable while loading
                  >
                    {isLoading ? (
                      <span className="header-logout-spinner"></span>
                    ) : (
                      "تسجيل الخروج"
                    )}
                  </button>
                </>
              ) : (
                <LinkToExternal
                  to="/login"
                  className="header-nav-link header-login-button"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تسجيل الدخول
                </LinkToExternal>
              )}
            </div>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
