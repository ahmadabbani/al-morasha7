import React from "react";
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
} from "lucide-react";
import dayjs from "dayjs";
import { Card, Container, Row, Col } from "react-bootstrap";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const checkDateStatus = (date) => {
    if (!date) return null;
    const today = dayjs();
    const sessionDate = dayjs(date);
    return sessionDate.isBefore(today);
  };

  return (
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
              <MapPin size={22} color=" #202d61" />
              <span>{user.district}</span>
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
                  لم تقم بحجز موعد بعد
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
            <Card.Body>
              {user.isPayed ? (
                <>
                  <h3 className="guide-title">الدليل الشامل</h3>
                  <div className="user-profile-placeholder-content">
                    <BookOpen size={24} color="#202d61" />
                    <h4> الدليل الخاص بك</h4>
                    <p>يمكنك الوصول إلى دليلك الشامل من هنا.</p>
                    <button className="user-profile-btn">تنزيل الدليل</button>
                  </div>
                </>
              ) : (
                <div className="user-profile-unpaid-notice">
                  <AlertCircle size={32} color="#202d61" />
                  <h3>الدفع مطلوب</h3>
                  <p>
                    يرجى حجز موعد جلسة أولاً أدناه إذا لم تقم بحجزها بعد. وبعد
                    قبول الجلسة وانتهائها، يمكنك الدفع هنا
                    <span className="user-profile-guide-price">
                      $السعر: 999
                    </span>
                  </p>
                  <button className="user-profile-btn">إجراء الدفع</button>
                  <button
                    className="user-profile-book-date-btn"
                    onClick={() =>
                      document
                        .querySelector(".user-profile-calendar-wrapper")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <span className="user-profile-bookbtn-scroll">
                      احجز موعدًا هنا
                    </span>
                    <ArrowDown size={18} className="user-profile-arrow-down" />
                  </button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="user-profile-public-section h-100">
            <Card.Body className="p-2">
              <img
                src="/images/cover-book.png"
                alt="Public Resource"
                className="user-profile-public-image"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Calendar Section */}
      <div className="user-profile-calendar-wrapper">
        <BookingCalendar
          userId={user?.id}
          className="user-profile-booking-calendar"
        />
      </div>
    </Container>
  );
};

export default Profile;
