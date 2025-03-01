import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ProtectedAdmin = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // Check both authentication and admin status
      if (!user || !user.isAdmin) {
        navigate("/admin/admin-login");
      }
    }
  }, [user, loading, navigate]);

  if (loading) return <div>جار التحميل...</div>;

  // Only render children if user exists and is admin
  return user && user.isAdmin ? children : null;
};

export default ProtectedAdmin;
