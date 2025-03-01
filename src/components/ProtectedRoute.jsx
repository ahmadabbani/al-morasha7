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
      }
    }
  }, [user, loading, navigate]);

  if (loading) return <div>جار التحميل...</div>;

  return user && !user.isAdmin ? children : null;
};

export default ProtectedRoute;
