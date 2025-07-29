import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";

//icons
import * as fiIcons from "react-icons/fi";

// Components
import { Cards, CardsOne } from "../../components/cards";

// Star display component
const StarDisplay = ({ value }) => {
  const rounded = Math.round(value * 10) / 10;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl ${
            star <= Math.round(rounded) ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
      <span className="ml-2 text-lg font-semibold text-gray-700">
        {rounded}
      </span>
    </div>
  );
};

const TutorDashboard = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [userId, setUserId] = useState("");
  const [avgRating, setAvgRating] = useState(null);
  const [announcement, setAnnouncement] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [areaRange, setAreaRange] = useState("7d");

  async function getName() {
    try {
      const response = await axios.get("http://localhost:5000/dashboard", {
        headers: { token: localStorage.getItem("token") },
      });
      setName(response.data.user_name);
      if (response.data.user_role) {
        setRole(response.data.user_role);
        localStorage.setItem("role", response.data.user_role);
      }
      // Assume user_id is available in the token or fetch separately
      if (response.data.user_id) {
        setUserId(response.data.user_id);
      } else {
        // fallback: fetch user_id from profile
        const profileRes = await axios.get(
          "http://localhost:5000/dashboard/profile",
          {
            headers: { token: localStorage.getItem("token") },
          }
        );
        if (profileRes.data && profileRes.data.user_id)
          setUserId(profileRes.data.user_id);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  // Fetch feedbacks and calculate average rating
  async function getAverageRating(uid) {
    try {
      if (!uid) return;
      const response = await axios.get(
        `http://localhost:5000/appointment/tutor/${uid}/feedback`
      );
      const feedbacks = response.data;
      if (feedbacks.length === 0) {
        setAvgRating(null);
        return;
      }
      const avg =
        feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
      setAvgRating(avg);
    } catch (err) {
      setAvgRating(null);
    }
  }

  const getAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/appointment/tutor",
        {
          headers: { token },
        }
      );
      setAppointments(response.data);
    } catch (err) {
      console.error(err.message);
      setMessage("Error loading appointments");
    } finally {
      setLoading(false);
    }
  };

  async function getAnnouncement() {
    try {
      const response = await axios.get("http://localhost:5000/announcement");
      setAnnouncement(response.data);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getFeedbacks() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/appointment/feedback/tutor/${userId}`,
        { headers: { token } }
      );
      setFeedbacks(response.data);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getName();
    getAnnouncement();
    getAppointments();
  }, []);

  useEffect(() => {
    if (userId) {
      getAverageRating(userId);
      getFeedbacks();
    }
  }, [userId]);

  // Helper: Filter appointments by date range
  function filterByRange(appts, range) {
    const now = new Date();
    let startDate;
    if (range === "7d") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
    } else if (range === "30d") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 29);
    } else if (range === "3m") {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 3);
    }
    return appts.filter(
      (a) => new Date(a.date) >= startDate && new Date(a.date) <= now
    );
  }

  // Helper: Format date as 'Mon DD'
  function formatShortDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  );

  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled" || a.status === "declined"
  );

  // Prepare area chart data
  const filteredAppointments = filterByRange(appointments, areaRange);
  // Get all unique dates in range
  const dateSet = new Set(filteredAppointments.map((a) => a.date));
  const sortedDates = Array.from(dateSet).sort();
  // Build data for each date
  const areaChartData = sortedDates.map((date) => {
    const booked = filteredAppointments.filter((a) => a.date === date).length;
    const completed = filteredAppointments.filter(
      (a) => a.date === date && a.status === "completed"
    ).length;
    const cancelled = filteredAppointments.filter(
      (a) =>
        a.date === date && (a.status === "cancelled" || a.status === "declined")
    ).length;
    return { date, booked, completed, cancelled };
  });

  // Get next sessions for today (only confirmed appointments)
  const nextSessions = appointments.filter(
    (a) =>
      new Date(a.date).toDateString() === new Date().toDateString() &&
      a.status === "confirmed"
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const dateToday = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex">
      <div className="min-h-screen flex-1 flex flex-col bg-white p-6">
        <div className="">
          <div className="flex justify-between items-center">
            <h1 className="text-[24px] font-bold text-[#132c91]">Dashboard</h1>

            {/* Show date today */}
            <p className="text-[13px] font-extralight text-[#696969] flex items-center gap-2">
              {dateToday}
            </p>
          </div>

          <h2 className="ttext-[24px] font-bold text-[#132c91]">
            Welcome, {name}!
          </h2>
          {/* Show average rating if available */}
          <div className="mt-2">
            {avgRating !== null ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Your Rating:</span>
                <StarDisplay value={avgRating} />
              </div>
            ) : (
              <span className="text-gray-500">No ratings yet</span>
            )}
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-7 mt-6">
            <Cards
              title="Sessions"
              icon={<fiIcons.FiCalendar />}
              count={completedAppointments.length}
            />
            <Cards
              title="Evaluations"
              icon={<fiIcons.FiCheckSquare />}
              count={feedbacks.length}
            />
            <Cards
              title="Tutee Request"
              icon={<fiIcons.FiUser />}
              count={appointments.length}
            />
            <Cards
              title="Cancellations"
              icon={<fiIcons.FiCalendar />}
              count={cancelledAppointments.length}
            />
          </div>

          <div className="mt-6 grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-7">
            <div className="lg:row-span-2">
              {/* Area Chart for Appointments */}
              <div className="bg-[#ffffff] p-3.5 rounded-lg border-2 border-[#EBEDEF]">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[#132c91] font-semibold">
                    Appointments Overview
                  </p>
                  <select
                    value={areaRange}
                    onChange={(e) => setAreaRange(e.target.value)}
                    className="bg-white border-0 outline-0 text-[#132c91] text-sm rounded-md p-[2px]"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="3m">Last 3 Months</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart
                    data={areaChartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatShortDate} />
                    <YAxis allowDecimals={false} />
                    <Tooltip labelFormatter={formatShortDate} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="booked"
                      stroke="#27aeef"
                      fill="#27aeef33"
                      name="Booked"
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#bdcf32"
                      fill="#bdcf3233"
                      name="Completed"
                    />
                    <Area
                      type="monotone"
                      dataKey="cancelled"
                      stroke="#ea5545"
                      fill="#ea554533"
                      name="Cancelled"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:row-span-2 flex flex-col gap-7">
              {/* Announcements */}
              <div className="bg-[#ffffff] p-3.5 rounded-lg border-2 border-[#EBEDEF]">
                <p className="text-[#132c91] font-semibold">Announcement</p>
                <div className="mt-2 ">
                  {announcement ? (
                    <div>
                      {announcement.announcement_content ? (
                        <p className="text-gray-700">
                          {announcement.announcement_content}
                        </p>
                      ) : (
                        <p className="text-gray-600">No content available</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">No announcement found.</p>
                  )}
                </div>
              </div>

              {/* Next Sessions Table */}
              <div className="bg-white p-3.5 rounded-lg border-2 border-[#EBEDEF] flex-1">
                <p className="text-[#132c91] font-semibold mb-4">
                  Confirmed Sessions Today
                </p>
                {nextSessions.length > 0 ? (
                  <div className="overflow-x-auto overflow-y-auto h-[180px]">
                    <table className="w-full text-[#1a1a1a]">
                      <thead>
                        <tr className="border-b border-[#EBEDEF]">
                          <th className="text-left font-bold py-3 px-2">
                            Time
                          </th>
                          <th className="text-left font-bold py-3 px-2">
                            Student
                          </th>
                          <th className="text-left font-bold py-3 px-2">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {nextSessions.map((session) => (
                          <tr
                            key={session.appointment_id}
                            className="border-b border-[#EBEDEF]"
                          >
                            <td className="py-3 px-2">
                              {formatTime(session.start_time)} -{" "}
                              {formatTime(session.end_time)}
                            </td>
                            <td className="py-3 px-2">
                              {session.student_name || "N/A"}
                            </td>
                            <td className="py-3 px-2">
                              {formatDate(session.date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[180px]">
                    <p className="text-gray-400 text-center">
                      No confirmed sessions today
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
