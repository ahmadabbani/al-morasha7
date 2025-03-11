import React, { useEffect } from "react";
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
} from "lucide-react";
import dayjs from "dayjs";
import { Card, Container, Row, Col } from "react-bootstrap";
import "./Profile.css";
import Footer from "./Footer";

const Profile = () => {
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const checkDateStatus = (date) => {
    if (!date) return null;
    const today = dayjs();
    const sessionDate = dayjs(date);
    return sessionDate.isBefore(today);
  };

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

              <div className="user-profile-info-item">
                {user.session_date ? (
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
                ) : (
                  <span className="user-profile-no-booking">
                    <Calendar size={22} color=" #202d61" strokeWidth={2} />
                    لم تحجز/ي موعد بعد
                  </span>
                )}
              </div>

              <div className="user-profile-info-item">
                {user.session_date ? (
                  user.status ? (
                    <span className="user-profile-status confirmed">
                      <CheckCircle size={22} />
                      تم تأكيد الموعد
                    </span>
                  ) : (
                    <span className="user-profile-status pending">
                      <Clock size={22} />
                      تأكيد الموعد قيد الانتظار
                    </span>
                  )
                ) : (
                  <span className="user-profile-no-booking">
                    <Calendar size={22} color=" #202d61" strokeWidth={2} />
                    الرجاء حجز موعد أولاً
                  </span>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Content Section */}
        <Row className="user-profile-content mb-4">
          <Col md={6}>
            <Card className="user-profile-payment-section h-100">
              <Card.Body className="p-4">
                {user.isPayed ? (
                  <>
                    <h2 className="guide-title">الدليل الشامل</h2>
                    <div className="user-profile-placeholder-content">
                      <BookOpen size={24} color="#202d61" />
                      <h4> الدليل الخاص بكم</h4>
                      <p>يمكنكم الوصول إلى الدليل الشامل من هنا</p>
                      <button className="user-profile-btn download-btn">
                        فتح الدليل
                      </button>
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
                      <span
                        style={{
                          display: "block",
                          fontSize: "1rem",
                        }}
                      >
                        للمزيد من التفاصيل حول طريقة الدفع بعد التواصل مع المدرب
                        وحجز موعد المقابلة الافتراضية
                      </span>
                    </h2>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="user-profile-public-section h-100">
              <Card.Body className="p-2">
                {/* <img
                src="/images/cover-book.png"
                alt="Public Resource"
                className="user-profile-public-image"
              /> */}
                {/* Calendar Section */}
                <BookingCalendar
                  userId={user?.id}
                  className="user-profile-booking-calendar"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <div style={{ direction: "rtl" }}>
        <Footer />
      </div>
    </>
  );
};

export default Profile;
