import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

//icons
import { IoIosNotifications } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Fetch pending appointments count
  const getPendingCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/appointment/tutor/pending-count",
        {
          headers: { token },
        }
      );
      setPendingCount(response.data.pending_count);
    } catch (err) {
      console.error("Error fetching pending count:", err.message);
    }
  };

  // Fetch unread notifications
  const getUnreadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/appointment/notifications",
        {
          headers: { token },
        }
      );
      const unread = response.data.filter(notification => notification.status === 'unread');
      setUnreadNotifications(unread);
      setUnreadCount(unread.length);
    } catch (err) {
      console.error("Error fetching notifications:", err.message);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/appointment/notifications/${notificationId}/read`,
        {},
        {
          headers: { token },
        }
      );
      // Refresh notifications
      getUnreadNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err.message);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    getPendingCount();
    getUnreadNotifications();
  }, []);

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      // Refresh data when opening dropdown
      getPendingCount();
      getUnreadNotifications();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const totalNotifications = pendingCount + unreadCount;

  return (
    <div className="pt-3 px-3 bg-white">
      <div className="flex gap-3 justify-end text-black text-2xl">
        {/* Notification Icon with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="relative p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoIosNotifications />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalNotifications}
              </span>
            )}
          </button>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <IoIosNotifications className="text-gray-600" />
                  Notifications
                </h3>
                
                <div className="space-y-3">
                  {/* Pending Appointments */}
                  {pendingCount > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <p className="text-blue-800 font-medium">
                        There {pendingCount === 1 ? 'is' : 'are'} {pendingCount} pending appointment{pendingCount > 1 ? 's' : ''}
                      </p>
                      <p className="text-blue-600 text-sm mt-1">
                        Review and respond to appointment requests
                      </p>
                    </div>
                  )}

                  {/* Unread Notifications */}
                  {unreadNotifications.map((notification) => (
                    <div 
                      key={notification.notification_id}
                      className="bg-yellow-50 border border-yellow-200 rounded-md p-3 cursor-pointer hover:bg-yellow-100 transition-colors"
                      onClick={() => markAsRead(notification.notification_id)}
                    >
                      <p className="text-yellow-800 text-sm">
                        {notification.notification_content}
                      </p>
                      <p className="text-yellow-600 text-xs mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}

                  {/* No notifications */}
                  {totalNotifications === 0 && (
                    <div className="text-gray-500 text-center py-4">
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <Link
                    to="/dashboard/schedules"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-between"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span>View all appointments</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Profile Icon */}
        <Link to="/dashboard/profile"><IoPersonCircleOutline /></Link>
      </div>
    </div>
  );
};

export default Header;
