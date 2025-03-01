// ResendVerification.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import "./ResendVerification.css";
const ResendVerification = ({ email = "", onClose }) => {
  const [emailInput, setEmailInput] = useState(email);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailInput) {
      toast.error("البريد الإلكتروني مطلوب");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/users/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailInput }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل إرسال بريد التحقق");
      }

      toast.success(data.message || "تم إرسال بريد التأكيد");
      setSent(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="resend-container" dir="rtl">
        <h3 className="resend-success">تم إرسال بريد التحقق</h3>
        <p className="resend-message">
          تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك
          الإلكتروني والنقر على الرابط للتأكيد.
        </p>
        <button onClick={onClose} className="resend-close-btn">
          إغلاق
        </button>
      </div>
    );
  }

  return (
    <div className="resend-container" dir="rtl">
      <h3 className="resend-title">إعادة إرسال بريد التحقق</h3>
      <form onSubmit={handleSubmit} className="resend-form">
        <div className="resend-form-group">
          <label htmlFor="email" className="resend-label">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني"
            required
            className="resend-input"
          />
        </div>
        <button type="submit" disabled={loading} className="resend-submit-btn">
          {loading ? "جاري الإرسال..." : "إرسال رابط التأكيد"}
        </button>
      </form>
      <button onClick={onClose} className="resend-cancel-btn">
        إلغاء
      </button>
    </div>
  );
};

export default ResendVerification;
