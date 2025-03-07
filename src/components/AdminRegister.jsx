import { useState } from "react";
import { toast } from "react-toastify";
import "./AdminRegister.css"; // Import the CSS file
import { Link, useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
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
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/admin/adminRegister`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "An error occurred during registration");

      toast.success("Registration successful! Please log in");
      setFormData({
        // Reset form
        name: "",
        email: "",
        password: "",
      });
      navigate("/admin/admin-login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-container">
      <Link to="/">
        <img
          src="/images/header-logo.png"
          alt="logo"
          className="admin-register-logo"
        />
      </Link>
      <h1 className="admin-register-heading">New Admin Account</h1>
      <form onSubmit={handleSubmit} className="admin-register-form">
        {/* Full Name */}
        <div className="admin-register-input-group">
          <label htmlFor="name" className="admin-register-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="name"
            className="admin-register-input"
          />
        </div>

        {/* Email */}
        <div className="admin-register-input-group">
          <label htmlFor="email" className="admin-register-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email"
            className="admin-register-input"
          />
        </div>

        {/* Password */}
        <div className="admin-register-input-group">
          <label htmlFor="password" className="admin-register-label">
            Password
          </label>
          <input
            type="password"
            id="register-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="password"
            className="admin-register-input"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="admin-register-submit-button"
          disabled={loading}
        >
          {loading ? (
            <div className="admin-register-spinner"></div>
          ) : (
            "Register"
          )}
        </button>

        {/* Legal Statement */}
        <p className="admin-register-legal">
          Your data will be used in accordance with our privacy policy. We will
          not share your information with third parties.
        </p>
      </form>
    </div>
  );
};

export default AdminRegister;
