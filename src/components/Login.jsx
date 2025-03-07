import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Mail, Lock, LogIn } from "lucide-react";
import "./Login.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import ResendVerification from "./ResendVerification";

const Login = () => {
  const url = `${import.meta.env.VITE_REACT_APP_API_URL}/users/auth/login`;
  console.log("Fetching from:", url);
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Frontend validation
    if (!formData.emailOrPhone || !formData.password) {
      toast.error("جميع الحقول مطلوبة");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include", // Include cookies in the request
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.needsVerification) {
          toast.error(data.error);
          setShowResendVerification(true);
          setLoading(false);
          return;
        }
        throw new Error(data.error || "فشل تسجيل الدخول");
      }

      setUser(data.user);
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/profile");
      // Redirect or update state here (e.g., set user data in context/state)
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container container my-5">
      {showResendVerification ? (
        <ResendVerification
          email={formData.email}
          onClose={() => setShowResendVerification(false)}
        />
      ) : (
        <>
          <h1 className="login-heading">تسجيل الدخول</h1>
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email or Phone */}
            <div className="login-input-group mb-4">
              <label htmlFor="emailOrPhone" className="login-label">
                <Mail className="icon" size={20} color="#202d61" />
                البريد الإلكتروني أو الهاتف
              </label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                placeholder="أدخل بريدك الإلكتروني أو هاتفك"
                className="login-input form-input"
                required
              />
            </div>

            {/* Password */}
            <div className="login-input-group mb-4">
              <label htmlFor="login-password" className="login-label">
                <Lock className="icon" size={20} color="#202d61" />
                كلمة المرور
              </label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور"
                className="login-input form-input"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="login-spinner"></div>
              ) : (
                <>
                  <LogIn className="icon" size={20} color="#FFFFFF" />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
