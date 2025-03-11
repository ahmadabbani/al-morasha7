import React, { useState, useEffect } from "react";
import { Button, Loader } from "@mantine/core";
import { FileDown, FileSpreadsheet, Unlock } from "lucide-react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "./AdminDashboard.css";
import BookingCalendar from "./BookingCalendar";
import * as XLSX from "xlsx";
import {
  Calendar,
  Calendar1,
  CalendarCheck,
  CheckCheck,
  Clock,
  Clock1,
  Clock10,
  Locate,
  LocateFixed,
  Mail,
  Map,
  MapPin,
  Navigation,
  Phone,
  Plus,
  User,
  Users,
  Vote,
  DollarSign,
} from "lucide-react";
import LogoutButton from "./LogoutButton";
import { isRouteErrorResponse, Link } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUsers, setUpdatingUsers] = useState(new Set());
  const [rejectingUsers, setRejectingUsers] = useState(new Set());
  const [isPayedUsers, setIsPayedUsers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [pagesState, setPagesState] = useState({
    pending: 1,
    bookedAccepted: 1,
    bookedPending: 1,
    allUsers: 1,
  });
  const itemsPerPage = 3;

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/admin/adminAction/acceptSession`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Function to open modal with user details
  const openUnlockModal = (userId, userName) => {
    setSelectedUser({ id: userId, name: userName });
    setIsModalOpen(true);
  };

  // Function to confirm unlock
  const handleConfirmUnlock = async () => {
    if (selectedUser) {
      setIsUnlocking(true); // Start loading
      await handleIsPayed(selectedUser.id, selectedUser.name); // Wait for unlocking
      setIsUnlocking(false); // Stop loading
      setIsModalOpen(false); // Close modal
      setSelectedUser(null);
    }
  };

  //pagination
  // Add this pagination helper function
  const paginateUsers = (usersList, boxId) => {
    const filteredUsers = filterUsersBySearch(usersList);
    const startIndex = (pagesState[boxId] - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  // Add this pagination controls component
  const renderPagination = (totalItems, boxId) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = pagesState[boxId];

    return totalPages > 1 ? (
      <div className="admin-pagination">
        {currentPage > 1 && (
          <button
            onClick={() =>
              setPagesState({
                ...pagesState,
                [boxId]: currentPage - 1,
              })
            }
            className="admin-pagination-button"
          >
            Back
          </button>
        )}

        <span className="admin-pagination-current">{currentPage}</span>

        {currentPage < totalPages && (
          <button
            onClick={() =>
              setPagesState({
                ...pagesState,
                [boxId]: currentPage + 1,
              })
            }
            className="admin-pagination-button"
          >
            Next
          </button>
        )}
      </div>
    ) : null;
  };

  // Callback to update the users list after an admin enable a booked date from calendar component
  const updateUsersList = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id
          ? { ...user, status: false, session_date: null, session_time: null }
          : user
      )
    );
  };

  const handleAcceptSession = async (userId) => {
    setUpdatingUsers((prev) => new Set(prev).add(userId));

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/admin/adminAction/acceptSession`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),

          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to update date status");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: true } : user
        )
      );

      toast.success("Session has been successfully accepted");
    } catch (error) {
      console.error("Error updating date status:", error);
      toast.error("Error updating date status");
    } finally {
      setUpdatingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleRejectSession = async (userId) => {
    setRejectingUsers((prev) => new Set(prev).add(userId));

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/admin/adminAction/rejectSession`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to reject the date");

      // Update users state to remove session date and time
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, session_date: null, session_time: null }
            : user
        )
      );

      toast.success("Session has been successfully rejected");
    } catch (error) {
      console.error("Error rejectng the appointment:", error);
      toast.error("An error occurred while rejecting the appointment");
    } finally {
      setRejectingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  //make isPayed true
  const handleIsPayed = async (userId, userName) => {
    setIsPayedUsers((prev) => new Set(prev).add(userId));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/admin/adminAction/isPayed`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),

          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to update user status");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isPayed: true } : user
        )
      );

      toast.success(
        `Contents Unlocked Successfully and email sent to ${userName}`
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("An error occured while unlocking contents");
    } finally {
      setIsPayedUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  //export to excel
  const handleExportToExcel = () => {
    if (!users || users.length === 0) {
      alert("No users to export");
      return;
    }

    // Prepare the data with specific fields
    const exportData = users.map((user) => {
      const formattedSessionDate = user.session_date
        ? `${dayjs(user.session_date).format("YYYY-MM-DD")} - ${
            user.session_time
          }`
        : "No Session Scheduled";
      return {
        ID: user.id,
        Name: user.name,
        Phone: user.phone,
        Email: user.email,
        Session_Date: formattedSessionDate,
        District: user.district,
        Region: user.region,
        Role: user.role,
        Payed: user.isPayed ? "Yes" : "No",
        Registered_at: dayjs(user.created_at).format("YYYY-MM-DD"),
      };
    });

    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

    // Generate and download the Excel file
    XLSX.writeFile(workbook, "Candidates.xlsx");
  };

  const handleSearch = () => {
    setIsSearching(!!searchQuery);
    setPagesState({
      pending: 1,
      bookedAccepted: 1,
      bookedPending: 1,
      allUsers: 1,
    }); // Reset to first page when searching
  };
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value === "") {
      // If input becomes empty
      setIsSearching(false); // Reset the search state
    }
  };
  const handleResetSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setPagesState({
      pending: 1,
      bookedAccepted: 1,
      bookedPending: 1,
      allUsers: 1,
    }); // Reset to first page when clearing search
  };

  const filterUsersBySearch = (usersList) => {
    if (!isSearching || !searchQuery) return usersList;

    return usersList.filter(
      (user) =>
        user.name === searchQuery ||
        user.email === searchQuery ||
        user.phone === searchQuery
    );
  };

  const renderSearchBar = () => (
    <div className="admin-top-bar">
      <div className="admin-search-container">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search by name, email or phone"
          value={searchQuery}
          onChange={handleSearchInputChange}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="admin-search-button" onClick={handleSearch}>
          Search
        </button>

        <button className="admin-search-button" onClick={handleResetSearch}>
          Reset
        </button>
      </div>
      <div className="admin-top-right">
        <Link
          to="/admin/admin-blog-dashboard"
          className="admin-create admin-create-blog"
        >
          <Plus size={24} />
          Create Blog
        </Link>
        <Link to="/admin/admin-register" className="admin-create">
          <Plus size={24} />
          New Admin
        </Link>
        <button
          onClick={handleExportToExcel}
          disabled={loading || users.length === 0}
          className="admin-create admin-export"
        >
          <FileSpreadsheet size={24} /> Export to Excel
        </button>
        <LogoutButton />{" "}
      </div>
    </div>
  );
  const renderUserBox = (title, Icon, usersList, boxColor, boxId) => {
    const filteredUsers = filterUsersBySearch(usersList);
    const paginatedUsers = paginateUsers(usersList, boxId);

    const checkDateStatus = (date) => {
      if (!date) return null;
      const today = dayjs();
      const sessionDate = dayjs(date);
      return sessionDate.isBefore(today);
    };

    return (
      <div className="admin-box">
        <div
          className="admin-box-title-wrapper"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3
            className="admin-box-title"
            style={{ color: boxColor, margin: 0 }}
          >
            <Icon />
            {title}
            {isSearching && (
              <span className="admin-results-count">
                ({filteredUsers.length} results found)
              </span>
            )}
          </h3>
          <span className="admin-paginated-count">
            {filteredUsers.length} users
          </span>
        </div>

        <div className="admin-users-list">
          {paginatedUsers.map((user) => (
            <div key={user.id} className="admin-user-card">
              {/* Left Side */}
              <div className="admin-user-details">
                <span className="admin-user-name">
                  {" "}
                  <User size={24} strokeWidth={2.5} />
                  {user.name}
                </span>
                <span className="admin-user-email">
                  <Mail size={22} strokeWidth={2.5} />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="admin-user-phone">
                    {" "}
                    <Phone size={22} strokeWidth={2.5} />
                    {user.phone}
                  </span>
                )}
                <span className="admin-user-email">
                  <CalendarCheck size={22} strokeWidth={2.5} />
                  Registered at:
                  <span>{dayjs(user.created_at).format("YYYY-MM-DD")}</span>
                </span>
                {user.session_date ? (
                  <>
                    <span
                      className={`admin-user-booking ${
                        checkDateStatus(user.session_date)
                          ? "date-passed"
                          : "date-active"
                      }`}
                    >
                      <Calendar size={22} strokeWidth={2} />
                      <span
                        className={`admin-user-booking ${
                          checkDateStatus(user.session_date)
                            ? "date-passed"
                            : "date-active"
                        }`}
                      >
                        Session Date:{" "}
                      </span>
                      {dayjs(user.session_date).format("YYYY-MM-DD")} -{" "}
                      {user.session_time}
                    </span>
                    {checkDateStatus(user.session_date) && (
                      <span className="date-status">date passed</span>
                    )}
                  </>
                ) : (
                  <span className="no-booking">
                    <Calendar size={19} strokeWidth={2} /> User hasn’t booked a
                    date yet
                  </span>
                )}
              </div>

              {/* Right Side */}
              <div className="admin-user-status">
                <span className="admin-user-district">
                  {user.district} <Map />
                </span>
                <span className="admin-user-district">
                  {user.region} <MapPin />
                </span>
                <span className="admin-user-role">
                  {user.role}
                  <Vote />
                </span>
                <span
                  className={`admin-payment-status ${
                    user.isPayed ? "is-paid" : "not-paid"
                  }`}
                >
                  {user.isPayed ? "Payed" : "Not Payed"}
                </span>

                <div className="admin-actions">
                  {user.status === false && user.session_date && (
                    <>
                      <button
                        className="admin-accept-button"
                        onClick={() => handleAcceptSession(user.id)}
                        disabled={
                          updatingUsers.has(user.id) ||
                          rejectingUsers.has(user.id)
                        }
                      >
                        {updatingUsers.has(user.id) ? (
                          <Loader size="sm" color="white" />
                        ) : (
                          "Accept"
                        )}
                      </button>
                      <button
                        className="admin-reject-button"
                        onClick={() => handleRejectSession(user.id)}
                        disabled={
                          updatingUsers.has(user.id) ||
                          rejectingUsers.has(user.id)
                        }
                      >
                        {rejectingUsers.has(user.id) ? (
                          <Loader size="sm" color="white" />
                        ) : (
                          "Reject"
                        )}
                      </button>
                    </>
                  )}
                  {!user.isPayed && (
                    <button
                      className="admin-unlock-button"
                      onClick={() => openUnlockModal(user.id, user.name)}
                      disabled={
                        updatingUsers.has(user.id) ||
                        rejectingUsers.has(user.id) ||
                        isPayedUsers.has(user.id)
                      }
                    >
                      {isPayedUsers.has(user.id) ? (
                        <Loader size="sm" color="white" />
                      ) : (
                        "Unlock"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <p className="admin-no-users">
              {isSearching ? "no results" : "no users"}
            </p>
          )}
        </div>
        {renderPagination(filteredUsers.length, boxId)}
        {/* Modal placed at the root of the component */}
        {isModalOpen && (
          <div className="unlock-confirmation-overlay">
            <div className="unlock-confirmation-modal">
              <div className="unlock-confirmation-icon">
                <Unlock size={24} />
              </div>
              <p className="unlock-confirmation-message">
                This will unlock the content for {selectedUser?.name}. They can
                access the guide in their profile, and an email will be sent to
                notify them.
              </p>
              <div className="unlock-confirmation-buttons">
                <button
                  className="unlock-confirmation-unlock-btn"
                  onClick={handleConfirmUnlock}
                  disabled={isUnlocking}
                >
                  {isUnlocking ? (
                    <span className="unlock-confirmation-spinner"></span> // Custom spinner
                  ) : (
                    "Unlock"
                  )}
                </button>
                <button
                  className="unlock-confirmation-cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader size="lg" />
      </div>
    );
  }

  /* const acceptedUsers = users.filter(
    (user) => user.status && user.session_date
  );*/

  const bookedAcceptedUsers = users.filter(
    (user) => user.status && user.session_date
  );
  const bookedPendingUsers = users.filter(
    (user) => !user.status && user.session_date
  );

  const payedUsers = users.filter((user) => user.isPayed);

  return (
    <div className="admin-container">
      <Link to="/">
        <img
          src="/images/header-logo.png"
          alt="logo"
          className="admin-dashboard-logo"
        />
      </Link>
      {renderSearchBar()}
      <div className="admin-dashboard">
        {renderUserBox("All Users", Users, users, "#9c27b0", "allUsers")}{" "}
        {renderUserBox(
          "Confirmed Sessions",
          CheckCheck,
          bookedAcceptedUsers,

          "#4caf50",
          "bookedAccepted"
        )}{" "}
        {renderUserBox(
          "Pending Approval",
          Clock,
          bookedPendingUsers,

          "#ff9800",
          "bookedPending"
        )}
        {renderUserBox(
          "Payed Users",
          DollarSign,
          payedUsers,

          "#2ecc71",
          "bookedPending"
        )}
      </div>
      <BookingCalendar updateUsersList={updateUsersList} />
    </div>
  );
};

export default AdminDashboard;
