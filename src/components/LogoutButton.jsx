import { toast } from "react-toastify";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LogoutButton.css";
import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";

const LogoutButton = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Call the logout endpoint
      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/auth/logout`,
        {
          method: "POST",
          credentials: "include", // Include cookies
        }
      );

      if (res.ok) {
        setUser(null); // Clear user state
        toast.success("Logout successful!"); // Success toast
        navigate("/login"); // Redirect to login page
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message || "An error occurred during logout");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="admin-logout-btn"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="icon spinner" size={20} /> // Spinner during loading
      ) : (
        <>
          Logout <LogOut className="icon" size={20} />
        </>
      )}
    </button>
  );
};

export default LogoutButton;
