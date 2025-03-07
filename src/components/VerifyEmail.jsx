// VerifyEmail.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Verification.css"; // Import the CSS file

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("رمز التحقق مفقود");
        return;
      }

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/users/auth/verify?token=${token}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "فشل التحقق من البريد الإلكتروني");
        }

        setStatus("success");
        toast.success(data.message || "تم التحقق من البريد الإلكتروني بنجاح");

        // Auto-redirect to login after 5 seconds
        setTimeout(() => {
          navigate("/login");
        }, 8000);
      } catch (error) {
        setStatus("error");
        setErrorMessage(error.message);
        toast.error(error.message);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  // Loading state
  if (status === "verifying") {
    return (
      <div className="verification-container" dir="rtl">
        <div className="verification-box">
          <h2>جاري التحقق من البريد الإلكتروني</h2>
          <div className="loading-spinner"></div>
          <p>يرجى الانتظار...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === "success") {
    return (
      <div className="verification-container" dir="rtl">
        <div className="verification-box success">
          <h2>تم التحقق بنجاح!</h2>
          <div className="success-icon">✓</div>
          <p>
            تم التحقق من بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول إلى
            حسابك.
          </p>
          <p>سيتم تحويلك تلقائياً إلى صفحة تسجيل الدخول خلال 8 ثوانٍ.</p>
          <button onClick={() => navigate("/login")} className="login-btn">
            الذهاب إلى صفحة تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="verification-container" dir="rtl">
      <div className="verification-box error">
        <h2>فشل التحقق</h2>
        <div className="error-icon">✗</div>
        <p>عذراً، لم نتمكن من التحقق من بريدك الإلكتروني.</p>
        <p className="error-message">{errorMessage}</p>
        <p>قد يكون الرابط قد انتهت صلاحيته أو تم استخدامه بالفعل.</p>
        <button onClick={() => navigate("/login")} className="login-btn">
          الذهاب إلى صفحة تسجيل الدخول
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
