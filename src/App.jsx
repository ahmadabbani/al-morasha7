import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import Header from "./components/Header";
import AdminDashboard from "./components/AdminDashboard";
import AdminRegister from "./components/AdminRegister";
import AdminLogin from "./components/AdminLogin";
import Admin from "./components/Admin";
import ProtectedAdmin from "./components/ProtectedAdmin";
import Home from "./components/Home";
import VerifyEmail from "./components/VerifyEmail";
import AdminBlogDashboard from "./components/AdminBlogDashboard";
import ResendVerification from "./components/ResendVerification";
import SingleBlog from "./components/SingleBlog";
import ResetPasswordRequest from "./components/ResetPasswordRequest";
import SetNewPassword from "./components/SetNewPassword";
import { MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {!isAdminRoute && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route
          path="/reset-password-request"
          element={<ResetPasswordRequest />}
        />
        <Route path="/reset-password" element={<SetNewPassword />} />
        <Route path="/blog/:id" element={<SingleBlog />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />}>
          <Route
            index
            element={
              <ProtectedAdmin>
                <AdminDashboard />
              </ProtectedAdmin>
            }
          />
          <Route
            path="admin-blog-dashboard"
            element={
              <ProtectedAdmin>
                <AdminBlogDashboard />
              </ProtectedAdmin>
            }
          />
          <Route
            path="admin-register"
            element={
              <ProtectedAdmin>
                <AdminRegister />
              </ProtectedAdmin>
            }
          />
          <Route path="admin-login" element={<AdminLogin />} />
        </Route>
      </Routes>
      {/* WhatsApp fixed icon */}
      <a
        href="https://wa.me/96171346435"
        className="whatsapp-icon"
        aria-label="Contact us on WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp />
      </a>
    </>
  );
}
export default App;
