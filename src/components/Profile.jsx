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
          <h2>Welcome, {user.name}</h2>
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
                      date passed
                    </span>
                  )}
                </>
              ) : (
                <span className="user-profile-no-booking">
                  <Calendar size={22} color=" #202d61" strokeWidth={2} />
                  User hasn't booked a date yet
                </span>
              )}
            </div>

            <div className="user-profile-info-item">
              {user.session_date ? (
                user.status ? (
                  <span className="user-profile-status confirmed">
                    <CheckCircle size={22} />
                    Session Confirmed
                  </span>
                ) : (
                  <span className="user-profile-status pending">
                    <Clock size={22} />
                    Waiting Confirmation
                  </span>
                )
              ) : (
                <span className="user-profile-no-booking">
                  <Calendar size={22} color=" #202d61" strokeWidth={2} />
                  Please book a session first
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
                  <h3 className="guide-title">Guide Book Access</h3>
                  <div className="user-profile-placeholder-content">
                    <BookOpen size={24} color=" #202d61" />
                    <h4>Your Guide Book</h4>
                    <p>Access your comprehensive guide and materials here.</p>
                    <button className="user-profile-btn">Download Guide</button>
                  </div>
                </>
              ) : (
                <div className="user-profile-unpaid-notice">
                  <AlertCircle size={32} color=" #202d61" />
                  <h3>Payment Required</h3>
                  <p>Please complete your payment to access the guide book</p>
                  <button className="user-profile-btn">Make Payment</button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="user-profile-public-section h-100">
            <Card.Body>
              <h3 className="guide-title">Public Resources</h3>
              <div className="user-profile-resources">
                <div className="user-profile-resource-item">
                  <BookOpen size={20} color=" #202d61" />
                  <span>Getting Started Guide</span>
                </div>
                <div className="user-profile-resource-item">
                  <BookOpen size={20} color=" #202d61" />
                  <span>FAQ Document</span>
                </div>
                <div className="user-profile-resource-item">
                  <BookOpen size={20} color=" #202d61" />
                  <span>Community Guidelines</span>
                </div>
              </div>
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
