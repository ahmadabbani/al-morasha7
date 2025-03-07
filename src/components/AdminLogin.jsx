import { useState } from "react";
import { toast } from "react-toastify";
import "./AdminLogin.css"; // Import the CSS file
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const AdminLogin = () => {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/admin/adminLogin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include", // Include cookies in the request
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "An error occurred during login");

      setUser(data.user);
      toast.success("Login successful");
      navigate("/admin");
      // Redirect or update state here (e.g., set user data in context/state)
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <Link to="/">
        <img
          src="/images/header-logo.png"
          alt="logo"
          className="admin-login-logo"
        />
      </Link>
      <h1 className="admin-login-heading">Login</h1>
      <form onSubmit={handleSubmit} className="admin-login-form">
        {/* Email or Phone */}
        <div className="admin-login-input-group">
          <label htmlFor="emailOrPhone" className="admin-login-label">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.emailOrPhone}
            onChange={handleChange}
            placeholder="email"
            className="admin-login-input"
            required
          />
        </div>

        {/* Password */}
        <div className="admin-login-input-group">
          <label htmlFor="password" className="admin-login-label">
            Password
          </label>
          <input
            type="password"
            id="login-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="password"
            className="admin-login-input"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="admin-login-submit-button"
          disabled={loading}
        >
          {loading ? <div className="admin-login-spinner"></div> : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
