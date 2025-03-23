import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SetNewPassword.css";

const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (newPassword !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/auth/set-new-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 3000); // Redirect after 3s
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("حدث خطأ أثناء تحديث كلمة المرور");
    } finally {
      setLoading(false); // Reset loading state when request completes
    }
  };

  return (
    <div className="set-new-password-container" dir="rtl">
      <div className="container set-new-password">
        <h2>تعيين كلمة مرور جديدة</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">كلمة المرور الجديدة</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="أدخل كلمة المرور الجديدة"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="أكد كلمة المرور"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? (
              <span>
                <span className="new-pass-spinner"></span>
              </span>
            ) : (
              "تعيين كلمة المرور"
            )}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default SetNewPassword;
