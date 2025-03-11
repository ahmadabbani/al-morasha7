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
import { AlertCircle, ArrowDown, Lock } from "lucide-react";

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
  const [disabledDays, setDisabledDays] = useState([]);
  const [loading, setLoading] = useState(false);
  //loading slots
  const [loadingSlots, setLoadingSlots] = useState(new Set());
  const [loadingDays, setLoadingDays] = useState(false);
  // Add these states alongside your existing ones (e.g., isModalOpen, selectedUser)
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isDisabling, setIsDisabling] = useState(false);
  // Generate all 24-hour slots with 15-minute intervals
  const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4)
      .toString()
      .padStart(2, "0");
    const minutes = (i % 4) * 15;
    return `${hour}:${minutes.toString().padStart(2, "0")}`;
  });

  // one day slot
  const daySlot = Array.from({ length: 1 }, (_, i) => {
    return "00:00 - 23:59"; // Represents the whole day
  });

  // Function to open the disable modal
  const openDisableModal = (time) => {
    setSelectedDay(time);
    setIsDisableModalOpen(true);
  };

  // Function to confirm disable action
  const handleConfirmDisable = async () => {
    if (selectedDay) {
      setIsDisabling(true); // Start loading
      await handleAdminDisable(selectedDay); // Execute the disable action
      setIsDisabling(false); // Stop loading
      setIsDisableModalOpen(false); // Close modal
      setSelectedDay(null);
    }
  };

  const fetchDisabledDays = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/getDisabledDays`
      );
      if (!response.ok) throw new Error("Failed to fetch disabled days");
      const disabledDays = await response.json();
      setDisabledDays(disabledDays); // Assume you have state for disabled days
    } catch (error) {
      console.error("Error fetching disabled days:", error);
      // Optionally handle the error (e.g., display a message)
    }
  };

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

      setBookedSlots(convertedSlots);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      //toast.error("حدث خطأ أثناء تحميل المواعيد المحجوزة");
    }
  };

  useEffect(() => {
    fetchDisabledDays();
    fetchBookedSlots();
  }, []);

  // Helper function to format Date object to "YYYY-MM-DD"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const formatted = `${year}-${month}-${day}`;
    return formatted;
  };

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
  ///////// here it will include fetched date (day) to be disbled) after fetching them from db when a full dy is disbaled

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

    if (time.includes(" - ")) {
      setLoadingDays(true);
    }
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
      // If time includes a range indicator ("-"), refresh only disabled days.
      // Otherwise, refresh the booked slots.
      if (time.includes(" - ")) {
        toast.success("The Day Was Successfully Disabled");
        await fetchDisabledDays();
      } else {
        toast.success("The Time Was Successfully Disabled");
        await fetchBookedSlots();
      }
    } catch (error) {
      console.error("Error disabling slot:", error);
      toast.error("An error occurred while disabling the date");
    } finally {
      // Existing loadingSlots cleanup (unchanged)
      setLoadingSlots((prev) => {
        const newSet = new Set(prev);
        newSet.delete(time);
        return newSet;
      });

      // New loadingDays cleanup (reset to false if it was set)
      if (time.includes(" - ")) {
        setLoadingDays(false);
      }
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
      toast.success("The date was successfully activated");
    } catch (error) {
      console.error("Error enabling slot:", error);
      toast.error("An error occurred while activating the date");
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
      <div
        style={{ fontWeight: "700", marginBottom: "2rem", color: "#202d61" }}
      >
        {!isAdmin ? (
          <>
            <h2>
              احجز موعدك{" "}
              <ArrowDown
                size={20}
                strokeWidth={3}
                className="user-profile-arrow-down"
              />
            </h2>
            <span style={{ fontSize: "0.9rem", fontWeight: "700" }}>
              يرجى اختيار الموعد المناسب لكم لحجز مكالمة فردية مجانية مع المدرب
              لمناقشة البرنامج التدريبي وتفاصيله
            </span>
          </>
        ) : (
          "Make a date available or unavailable"
        )}
      </div>
      <DatePicker
        value={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          setSelectedTime(null);
        }}
        firstDayOfWeek={1}
        minDate={new Date()}
        excludeDate={(date) => {
          const day = date.getDay();
          const isWeekend = day === 0 || day === 6;

          const formattedDate = formatDate(date);
          const isDisabled = disabledDays.includes(formattedDate);

          return isWeekend || isDisabled;
        }}
        locale="ar"
        mb="xl"
        className="profile-datepicker"
      />

      {selectedDate && (
        <div className="profile-time-section">
          <div className={isAdmin ? "calendar-top-header" : ""}>
            <Text
              size="lg"
              fw={700}
              mb={isAdmin ? 0 : "md"}
              c="#202d61"
              style={isAdmin ? { width: "fit-content" } : undefined}
            >
              {!isAdmin ? "اختر الوقت" : "Disable a Time"}
            </Text>
            {isAdmin &&
              daySlot.map((time) => (
                <div key={time} className="disable-day-container">
                  <p className="disable-day-text">
                    To disable the full day, click here:
                  </p>
                  <button
                    onClick={() => openDisableModal(time)}
                    className="disable-day-button"
                    disabled={
                      loadingSlots.has(time) ||
                      (time.includes(" - ") && loadingDays)
                    }
                  >
                    {time.includes(" - ") && loadingDays ? (
                      <span className="disable-day-spinner">⏳</span>
                    ) : (
                      selectedDate.toDateString()
                    )}
                  </button>
                </div>
              ))}
          </div>

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
        <button
          onClick={handleBooking}
          loading={loading}
          className="profile-confirm-button"
        >
          {loading ? <span className="booking-spinner"></span> : "تأكيد الحجز"}
        </button>
      )}
      {isDisableModalOpen && (
        <div className="disable-day-confirmation-overlay">
          <div className="disable-day-confirmation-modal">
            <div className="disable-day-confirmation-icon">
              <Lock size={24} />
            </div>
            <p className="disable-day-confirmation-message">
              This will disable the entire day. It will no longer be available
              for scheduling.
            </p>
            <div className="disable-day-confirmation-buttons">
              <button
                className="disable-day-confirmation-disable-btn"
                onClick={handleConfirmDisable}
                disabled={isDisabling}
              >
                {isDisabling ? (
                  <span className="disable-day-confirmation-spinner"></span>
                ) : (
                  "Disable"
                )}
              </button>
              <button
                className="disable-day-confirmation-cancel-btn"
                onClick={() => setIsDisableModalOpen(false)}
                disabled={isDisabling} // Optional: disable Cancel during loading
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
