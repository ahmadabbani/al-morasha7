import React, { useState, useEffect } from "react";
import { DatePicker } from "@mantine/dates";
import {
  Text,
  Grid,
  Button,
  Paper,
  LoadingOverlay,
  Loader,
} from "@mantine/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useAuth } from "../components/AuthContext";
import { toast } from "react-toastify";
import "./Profile.css";

// Add timezone plugins to dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

// Get user's timezone
const userTimezone = dayjs.tz.guess();

export default function BookingCalendar({
  userId = "",
  updateUsersList = () => {},
}) {
  const { user, setUser } = useAuth();
  const isAdmin = user?.isAdmin;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  //loading slots
  const [loadingSlots, setLoadingSlots] = useState(new Set());

  // Generate all 24 hour slots
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const fetchBookedSlots = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/getSessions`
      );
      if (!response.ok) throw new Error("Failed to fetch booked slots");
      const data = await response.json();

      // Simpler conversion since we're getting formatted time from backend
      const convertedSlots = data.map((slot) => ({
        ...slot,
        session_date: dayjs(slot.session_date).format("YYYY-MM-DD"),
        session_time: slot.session_time, // Already in HH:MM format
      }));
      console.log("convertedslots:", convertedSlots);

      setBookedSlots(convertedSlots);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      //toast.error("حدث خطأ أثناء تحميل المواعيد المحجوزة");
    }
  };

  useEffect(() => {
    fetchBookedSlots();
  }, []);

  const isTimeSlotBooked = (time) => {
    return bookedSlots.some((slot) => {
      const slotDate = dayjs(slot.session_date).format("YYYY-MM-DD");
      const selectedDateStr = dayjs(selectedDate).format("YYYY-MM-DD");
      return slotDate === selectedDateStr && slot.session_time === time;
    });
  };

  const isTimeSlotPast = (time) => {
    if (!dayjs(selectedDate).isSame(dayjs(), "day")) return false;
    const [hours] = time.split(":");
    return dayjs().tz(userTimezone).hour() >= parseInt(hours);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const isDateDisabled = (date) => {
    return date < dayjs().tz(userTimezone).startOf("day").toDate();
  };

  const handleBooking = async () => {
    if (!userId) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    setLoading(true);
    try {
      // Convert to ISO format for backend
      const bookingDate = dayjs(selectedDate).format("YYYY-MM-DD");
      const bookingTime = selectedTime;

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/bookSession`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-User-Timezone": userTimezone, // Send timezone to backend
          },
          body: JSON.stringify({
            userId,
            sessionDate: bookingDate,
            sessionTime: bookingTime,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }
      // Update user state with session_date and session_time (matching Profile usage)
      setUser((prevUser) => ({
        ...prevUser,
        session_date: bookingDate, // Use underscore to match user.session_date
        session_time: bookingTime, // Use underscore to match user.session_time
      }));
      toast.success("تم حجز الموعد بنجاح");

      // Reset selection
      setSelectedDate(null);
      setSelectedTime(null);

      // Refresh booked slots
      fetchBookedSlots();
    } catch (error) {
      console.error("Error booking session:", error);
      toast.error(error.message || "حدث خطأ أثناء حجز الموعد");
    } finally {
      setLoading(false);
    }
  };

  //to check if slot is disabled by admin
  const isTimeSlotDisabledByAdmin = (time) => {
    return bookedSlots.some((slot) => {
      const slotDate = dayjs(slot.session_date).format("YYYY-MM-DD");
      const selectedDateStr = dayjs(selectedDate).format("YYYY-MM-DD");
      return (
        slotDate === selectedDateStr &&
        slot.session_time === time &&
        slot.disabled_by === "admin"
      );
    });
  };

  // Admin handlers
  const handleAdminDisable = async (time) => {
    if (!isAdmin) return;
    setLoadingSlots((prev) => new Set(prev).add(time));
    const bookingDate = dayjs(selectedDate).format("YYYY-MM-DD");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/adminDisabled`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: bookingDate,
            time: time,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to disable date");

      // Refresh booked slots
      await fetchBookedSlots();
      toast.success("تم تعطيل الموعد بنجاح");
    } catch (error) {
      console.error("Error disabling slot:", error);
      toast.error("حدث خطأ أثناء تعطيل الموعد");
    } finally {
      setLoadingSlots((prev) => {
        const newSet = new Set(prev);
        newSet.delete(time);
        return newSet;
      });
    }
  };

  const handleAdminEnable = async (time) => {
    if (!isAdmin) return;
    setLoadingSlots((prev) => new Set(prev).add(time));

    const bookingDate = dayjs(selectedDate).format("YYYY-MM-DD");
    const isUserBooking = bookedSlots.some(
      (slot) =>
        dayjs(slot.session_date).format("YYYY-MM-DD") === bookingDate &&
        slot.session_time === time &&
        slot.disabled_by === "user"
    );
    const bookedSlot = isUserBooking
      ? bookedSlots.find(
          (slot) => slot.session_time === time && slot.disabled_by === "user"
        )
      : null;

    const id = bookedSlot ? bookedSlot.id : null; // Get the user ID if found

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/users/adminEnabled?isUserBooking=${isUserBooking}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: bookingDate,
            time: time,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to enable date");
      // Call the parent function only if userId exists
      if (id) {
        updateUsersList({ id: id });
      }
      // Refresh booked slots
      await fetchBookedSlots();
      toast.success("تم تفعيل الموعد بنجاح");
    } catch (error) {
      console.error("Error enabling slot:", error);
      toast.error("حدث خطأ أثناء تفعيل الموعد");
    } finally {
      setLoadingSlots((prev) => {
        const newSet = new Set(prev);
        newSet.delete(time);
        return newSet;
      });
    }
  };

  return (
    <div className="profile-container">
      <LoadingOverlay visible={loading} />

      <Text size="lg" fw={700} mb="md" c="#202d61">
        {!isAdmin ? "احجز موعدك" : "Make a date available or unavailable"}
      </Text>

      <DatePicker
        value={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          setSelectedTime(null);
        }}
        excludeDate={isDateDisabled}
        locale="ar"
        firstDayOfWeek={0}
        minDate={new Date()}
        mb="xl"
        className="profile-datepicker"
      />

      {selectedDate && (
        <div className="profile-time-section">
          <Text size="lg" fw={700} mb="md" c="#202d61">
            {!isAdmin ? "اختر الوقت" : "Select a Time"}
          </Text>

          <Grid className="profile-time-grid">
            {timeSlots.map((time) => {
              const isBooked = isTimeSlotBooked(time);
              const isPast = isTimeSlotPast(time);
              const isAdminDisabled = isTimeSlotDisabledByAdmin(time);
              const isDisabled = isBooked || isPast || isAdminDisabled;

              return (
                <Grid.Col span={4} key={time} className="profile-time-col">
                  <Paper
                    p="md"
                    onClick={() => {
                      if (isAdmin) {
                        if (isBooked || isAdminDisabled) {
                          handleAdminEnable(time);
                        } else {
                          handleAdminDisable(time);
                        }
                      } else if (!isDisabled) {
                        handleTimeSelect(time);
                      }
                    }}
                    className={`profile-time-slot 
                      ${isDisabled ? "profile-time-slot-disabled" : ""} 
                      ${
                        isAdminDisabled
                          ? "profile-time-slot-admin-disabled"
                          : ""
                      } 
                      ${
                        selectedTime === time
                          ? "profile-time-slot-selected"
                          : ""
                      }
                       ${isAdmin ? "profile-time-slot-admin" : ""}`}
                  >
                    <Text align="center" className="profile-time-text">
                      {loadingSlots.has(time) ? (
                        <Loader size="sm" variant="dots" />
                      ) : (
                        time
                      )}
                    </Text>
                  </Paper>
                </Grid.Col>
              );
            })}
          </Grid>
        </div>
      )}

      {selectedDate && selectedTime && (
        <Button
          w={200}
          mt="xl"
          onClick={handleBooking}
          loading={loading}
          size="lg"
          className="profile-confirm-button"
        >
          تأكيد الحجز
        </Button>
      )}
    </div>
  );
}
