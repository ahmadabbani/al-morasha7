import { useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  Phone,
  Mail,
  MapPin,
  UserCheck,
  Lock,
  KeyRound,
} from "lucide-react";
import "./Register.css"; // Import the CSS file
import "./Verification.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    district: "",
    role: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  // Dropdown options
  const roles = [
    "مرشح/ة  لمجلس البلدية",
    "مرشح/ة  مختار",
    "مدير/ة  حملة إنتخابية",
    "ناشط/ة  سياسي/ة محلي/ة",
  ];

  const districts = [
    "قضاء جبيل",
    "قضاء كسروان",
    "قضاء المتن",
    "قضاء بعبدا",
    "قضاء عاليه",
    "قضاء الشوف",
    "قضاء الهرمل",
    "قضاء بعلبك",
    "قضاء زحلة",
    "قضاء البقاع الغربي",
    "قضاء راشيا",
    "قضاء عكار",
    "قضاء طرابلس",
    "قضاء زغرتا - الزاوية",
    "قضاء بشري",
    "قضاء البترون",
    "قضاء الكورة",
    "قضاء المنية",
    "قضاء صيدا",
    "قضاء صور",
    "قضاء جزين",
    "قضاء النبطية",
    "قضاء حاصبيا",
    "قضاء مرجعيون",
    "قضاء بنت جبيل",
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Frontend validation
    if (Object.values(formData).some((value) => value.trim() === "")) {
      toast.error("جميع الحقول مطلوبة");
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("البريد الإلكتروني غير صالح");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "حدث خطأ أثناء التسجيل");

      toast.success(
        data.message || "تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني"
      );
      setRegistered(true);

      setFormData({
        // Reset form
        name: "",
        phone: "",
        email: "",
        district: "",
        role: "",
        password: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="verification-message" dir="rtl">
        <h2>تم التسجيل بنجاح!</h2>
        <p>
          لقد أرسلنا رسالة تأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك
          الإلكتروني وانقر على الرابط الموجود في الرسالة لتفعيل حسابك.
        </p>
        <p>
          لم تصل الرسالة؟ تحقق من مجلد البريد العشوائي أو{" "}
          <button
            onClick={() => navigate("/resend-verification")}
            className="resend-btn"
          >
            إعادة إرسال رسالة التأكيد
          </button>
        </p>
        <button onClick={() => navigate("/login")} className="login-btn">
          الذهاب إلى صفحة تسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div className="register-container container my-5">
      <h1 className="register-heading">انضم إلينا</h1>
      <form onSubmit={handleSubmit} className="register-form">
        {/* Full Name */}
        <div className="register-input-group mb-4">
          <label htmlFor="name" className="register-label">
            <User className="icon" size={20} color="#202d61" />
            الاسم الكامل
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="أدخل اسمك الكامل"
            className="register-input form-input"
          />
        </div>

        {/* Phone */}
        <div className="register-input-group mb-4">
          <label htmlFor="phone" className="register-label">
            <Phone className="icon" size={20} color="#202d61" />
            الهاتف
          </label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="أدخل رقم هاتفك"
            className="register-input form-input"
          />
        </div>

        {/* Email */}
        <div className="register-input-group mb-4">
          <label htmlFor="email" className="register-label">
            <Mail className="icon" size={20} color="#202d61" />
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="أدخل بريدك الإلكتروني"
            className="register-input form-input"
          />
        </div>

        {/* District Dropdown */}
        <div className="register-input-group mb-4">
          <label htmlFor="district" className="register-label">
            <MapPin className="icon" size={20} color="#202d61" />
            القضاء
          </label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="register-select form-input"
          >
            <option value="" disabled>
              اختر القضاء
            </option>
            {districts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Role Dropdown */}
        <div className="register-input-group mb-4">
          <label htmlFor="role" className="register-label">
            <UserCheck className="icon" size={20} color="#202d61" />
            هل أنت:
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="register-select form-input"
          >
            <option value="" disabled>
              هل أنت:
            </option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Password */}
        <div className="register-input-group mb-4">
          <label htmlFor="register-password" className="register-label">
            <Lock className="icon" size={20} color="#202d61" />
            كلمة المرور
          </label>
          <input
            type="password"
            id="register-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="أدخل كلمة المرور"
            className="register-input form-input"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="register-submit-button submit-btn"
          disabled={loading}
        >
          {loading ? (
            <div className="register-spinner"></div>
          ) : (
            <>
              <KeyRound className="icon" size={20} color="#FFFFFF" />
              تسجيل
            </>
          )}
        </button>

        {/* Legal Statement */}
        <p className="register-legal">
          سيتم استخدام بياناتك وفقًا لسياسة الخصوصية الخاصة بنا. لن نشارك
          معلوماتك مع أطراف ثالثة.
        </p>
      </form>
    </div>
  );
};

export default Register;
