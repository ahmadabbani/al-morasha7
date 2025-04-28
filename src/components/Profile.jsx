import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";

import BookingCalendar from "./BookingCalendar";
import LogoutButton from "./LogoutButton";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  BookOpen,
  AlertCircle,
  ArrowDown,
  Map,
  Book,
  Hotel,
  ChevronsRightLeftIcon,
  Badge,
  BadgeCent,
  BadgeCheck,
  BadgeCheckIcon,
  Medal,
  UserCheck,
} from "lucide-react";
import dayjs from "dayjs";
import { Card, Container, Row, Col } from "react-bootstrap";
import "./Profile.css";
import Footer from "./Footer";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Clean up the blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (fileUrl) {
        window.URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const checkDateStatus = (date) => {
    if (!date) return null;
    const today = dayjs();
    const sessionDate = dayjs(date);
    return sessionDate.isBefore(today);
  };

  const handleOpenGuide = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/admin/adminAction/serveGuide`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!res.ok) {
        window.location.href = "/";
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setFileUrl(url);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error opening guide:", error);
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages));

  return (
    <>
      <Container className="user-profile-container">
        {/* Welcome Widget */}
        <Card className="user-profile-welcome-widget mb-4">
          <Card.Body>
            <User size={43} className="user-profile-avatar-icon" />
            <h2> {user.name} ,مرحبًا</h2>
          </Card.Body>
        </Card>

        {/* User Info Widget */}
        <Card className="user-profile-info-widget mb-4">
          <Card.Body>
            <div className="user-profile-info-grid">
              <div className="user-profile-info-item">
                <Mail size={22} color=" #202d61" />
                <span>{user.email}</span>
              </div>
              <div className="user-profile-info-item">
                <Map size={22} color=" #202d61" />
                <span>{user.district}</span>
              </div>
              <div className="user-profile-info-item">
                <MapPin size={22} color=" #202d61" />
                <span>{user.region}</span>
              </div>
              <div className="user-profile-info-item">
                <Phone size={22} color=" #202d61" />
                <span>{user.phone}</span>
              </div>
              <div className="user-profile-info-item">
                <User size={22} color=" #202d61" />
                <span>{user.role}</span>
              </div>
              {user.session_date && (
                <div className="user-profile-info-item">
                  <>
                    <span
                      className={`user-profile-booking ${
                        checkDateStatus(user.session_date)
                          ? "date-passed"
                          : "date-active"
                      }`}
                    >
                      <Calendar size={22} strokeWidth={2} />
                      {dayjs(user.session_date).format("YYYY-MM-DD")} -{" "}
                      {user.session_time}
                    </span>
                    {checkDateStatus(user.session_date) && (
                      <span className="user-profile-date-status">
                        الوقت قد مضى
                      </span>
                    )}
                    <span>الموعد المحجوز</span>
                  </>
                </div>
              )}
              {user.session_date && (
                <div className="user-profile-info-item">
                  {user.status ? (
                    <span className="user-profile-status confirmed">
                      <CheckCircle size={22} />
                      تم تأكيد الموعد
                    </span>
                  ) : (
                    <span className="user-profile-status pending">
                      <Clock size={22} />
                      تأكيد الموعد قيد الانتظار
                    </span>
                  )}
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Content Section */}
        <Row className="user-profile-content mb-4">
          <Col md={12}>
            <Card className="user-profile-payment-section h-100">
              <Card.Body className="p-4">
                {user.isPayed ? (
                  <>
                    <h2 className="guide-title">الدليل الشامل</h2>
                    <div className="user-profile-placeholder-content">
                      <BookOpen size={24} color="#202d61" />
                      <h4> الدليل الخاص بكم</h4>
                      <p>يمكنكم الوصول إلى الدليل الشامل من هنا</p>
                      <button
                        className="user-profile-btn download-btn"
                        onClick={handleOpenGuide}
                        disabled={loading}
                      >
                        {loading ? "اِنتظر..." : "فتح الدليل"}
                      </button>
                      {isModalOpen && fileUrl && (
                        <div className="pdf-modal">
                          <div className="pdf-modal-content">
                            <div className="pdf-modal-header">
                              <button
                                className="pdf-modal-close"
                                onClick={closeModal}
                              >
                                ×
                              </button>
                            </div>
                            <div className="pdf-modal-body">
                              <iframe
                                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                width="100%"
                                height="100%"
                                title="PDF Viewer"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="user-profile-unpaid-notice">
                    <h2>
                      <span style={{ marginBottom: "2rem", display: "block" }}>
                        !شكراً لاهتمامكم
                      </span>
                      <span
                        className="user-profile-guide-price"
                        style={{
                          position: "relative",
                          display: "inline-block",
                          fontSize: "2rem",
                        }}
                      >
                        <span
                          className="text-muted"
                          style={{
                            position: "relative",
                            marginRight: "12px",
                            display: "inline-block",
                          }}
                        >
                          $1199
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              top: "50%",
                              height: "2px",
                              backgroundColor: "gray",
                              transform: "rotate(-10deg)",
                            }}
                          ></span>
                        </span>
                        $السعر: 999
                      </span>
                    </h2>
                    <div className="user-profile-list">
                      <h3>تغطي التكاليف النقاط التالية:</h3>
                      <ul>
                        <li>
                          <span style={{ marginLeft: "8px" }}>
                            {" "}
                            <Book size={22} color="#1E3A8A" />
                          </span>
                          الدليل القانوني والعلمي
                        </li>
                        <li>
                          <span style={{ marginLeft: "8px" }}>
                            <CheckCircle size={22} color="#2E7D32" />
                          </span>
                          التقييم الذاتي من شركة Stewart Leadership العالمية
                        </li>
                        <li>
                          <span style={{ marginLeft: "8px" }}>
                            <Hotel size={22} color="#8B5C2E" />
                          </span>
                          تكاليف الفندق كاملةً لمدّة يومين
                        </li>
                        <li>
                          <span style={{ marginLeft: "8px" }}>
                            <UserCheck size={22} color="#C62828" />
                          </span>
                          ١٢ ساعة من الكوتشينغ
                        </li>
                        <li>
                          <span style={{ marginLeft: "8px" }}>
                            <Medal size={22} color="#4CAF50" />
                          </span>
                          شهادة مشاركة من Stewart Leadership
                        </li>
                      </ul>
                    </div>

                    {/*   <span
                      style={{
                        display: "block",
                        fontSize: "1rem",
                        marginTop: "2rem",
                      }}
                    >
                      للمزيد من التفاصيل حول طريقة الدفع بعد التواصل مع المدرب
                      وحجز موعد المقابلة الافتراضية
                    </span> */}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* <Col md={6}>
            <Card className="user-profile-public-section h-100">
              <Card.Body className="p-2">
               
               
                <BookingCalendar
                  userId={user?.id}
                  className="user-profile-booking-calendar"
                />
              </Card.Body>
            </Card>
          </Col> */}
        </Row>
      </Container>
      <div style={{ direction: "rtl" }}>
        <Footer />
      </div>
    </>
  );
};

export default Profile;
