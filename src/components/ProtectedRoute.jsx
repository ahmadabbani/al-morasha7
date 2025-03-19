import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (user.isAdmin) {
        navigate("/admin");
      } else if (!user.isConfirmed) {
        // If user exists, is not admin, but is not confirmed, navigate home.
        navigate("/");
      }
    }
  }, [user, loading, navigate]);

  if (loading)
    return (
      <div
        style={{
          fontSize: "1rem",
          fontWeight: "600",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "3rem",
          color: "#202d61",
          height: "100vh",
        }}
      >
        جار التحميل...
      </div>
    );

  return user && !user.isAdmin && user.isConfirmed ? children : null;
};

export default ProtectedRoute;
