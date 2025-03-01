import {
  Link as LinkToExternal,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
  const navigate = useNavigate();
  const isAuthPage = ["/login", "/register", "/profile"].includes(
    location.pathname
  );
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
    try {
      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/logout`,
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
    }
  };

  return (
    <header
      className={`header-container ${scrolled ? "header-scrolled" : ""} ${
        !isHome ? "header-not-home" : ""
      }`}
    >
      <nav className="header-nav">
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
              >
                من نحن
              </ScrollLink>
              <ScrollLink
                to="contact"
                offset={-70}
                smooth={true}
                duration={0}
                className="header-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                اتصل بنا
              </ScrollLink>
            </>
          )}
          {/*<Link to="/register" className="header-nav-link" onClick={() => setIsMenuOpen(false)}>
          تسجيل
        </Link> */}
          {/* Conditional links */}
          {/* {!loading && (
          <div className="header-auth-links">
            {user ? (
              <>
                {!user.isAdmin && (
                  <Link to="/profile" className="header-nav-link" onClick={() => setIsMenuOpen(false)}>
                    حسابي
                  </Link>
                )}
                <button
                  onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  className="header-nav-link header-logout-button"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <Link to="/login" className="header-nav-link header-login-button" onClick={() => setIsMenuOpen(false)}>
                تسجيل الدخول
              </Link>
            )}
          </div>
        )} */}
        </div>
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
      </nav>
    </header>
  );
};

export default Header;
