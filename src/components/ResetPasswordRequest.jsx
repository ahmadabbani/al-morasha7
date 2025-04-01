import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPasswordRequest.css";

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false); // Reset loading state when request completes
    }
  };

  return (
    <div className="reset-password-container" dir="rtl">
      <div className="container reset-password-request">
        <h2>إعادة تعيين كلمة المرور</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="أدخل/ي البريد الإلكتروني"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? (
              <span>
                <span className="reset-pass-spinner"></span>
              </span>
            ) : (
              "إرسال رابط إعادة التعيين"
            )}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordRequest;
