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
import * as fiIcons from "react-icons/fi";

// Components
import { Cards, CardsOne } from "../../components/cards";

function Dashboard() {
  const [name, setName] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [appointments, setAppointments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [areaRange, setAreaRange] = useState('7d');

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
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getAppointments() {
    try {
      const response = await axios.get(
        "http://localhost:5000/dashboard/appointment/admin",
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setAppointments(response.data);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getFeedbacks() {
    try {
      const response = await axios.get(
        "http://localhost:5000/appointment/feedback/admin",
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setFeedbacks(response.data);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getName();
    getAppointments();
    getFeedbacks();
  }, []);

  // Helper: Get weekday name from date string
  function getWeekday(dateString) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(dateString);
    return days[date.getDay()];
  }

  // Helper: Filter appointments by date range
  function filterByRange(appts, range) {
    const now = new Date();
    let startDate;
    if (range === '7d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
    } else if (range === '30d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 29);
    } else if (range === '3m') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 3);
    }
    return appts.filter(a => new Date(a.date) >= startDate && new Date(a.date) <= now);
  }

  // Helper: Format date as 'Mon DD'
  function formatShortDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Prepare data for bar chart: confirmed appointments per weekday
  const confirmedAppointments = appointments.filter(
    (a) =>
      a.status === "confirmed" ||
      a.status === "started" ||
      a.status === "completed"
  );
  const weekdayCounts = confirmedAppointments.reduce((acc, appt) => {
    const weekday = getWeekday(appt.date);
    acc[weekday] = (acc[weekday] || 0) + 1;
    return acc;
  }, {});
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const barChartData = weekdays.map((day) => ({
    weekday: day,
    count: weekdayCounts[day] || 0,
  }));

  // Total number of cancelled appointments
  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled"
  );
  const cancelledCount = cancelledAppointments.length;

  //Total number of completed appointments
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  );

  const completedCount = completedAppointments.length;

  //Total number of feedbacks
  const feedbackCount = feedbacks.length;

  // Prepare area chart data
  const filteredAppointments = filterByRange(appointments, areaRange);
  // Get all unique dates in range
  const dateSet = new Set(filteredAppointments.map(a => a.date));
  const sortedDates = Array.from(dateSet).sort();
  // Build data for each date
  const areaChartData = sortedDates.map(date => {
    const booked = filteredAppointments.filter(a => a.date === date).length;
    const completed = filteredAppointments.filter(a => a.date === date && a.status === 'completed').length;
    const cancelled = filteredAppointments.filter(a => a.date === date && a.status === 'cancelled').length;
    return { date, booked, completed, cancelled };
  });

  const barColors = [
    "#ea5545", // Mon
    "#ef9b20", // Tue
    "#edbf33", // Wed
    "#bdcf32", // Thu
    "#27aeef", // Fri
    "#b33dc6", // Sat
    "#ffa300", // Sun
  ];

  return (
    <div className="flex">
      <div className="min-h-screen flex-1 flex flex-col bg-white p-6">
        <div className="">
          <div className="flex justify-between items-center">
            <h2 className="text-[24px] font-bold text-[#132c91]">
              Welcome, {name}!
            </h2>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-7 mt-6">
            <Cards
              title="Sessions"
              icon={<fiIcons.FiCalendar />}
              count={completedCount}
            />

            <Cards
              title="Evaluations"
              icon={<fiIcons.FiCheckSquare />}
              count={feedbackCount}
            />

            <Cards
              title="Tutee Request"
              icon={<fiIcons.FiUser />}
              count={appointments.length}
            />

            <Cards
              title="Cancellations"
              icon={<fiIcons.FiCalendar />}
              count={cancelledCount}
            />
          </div>

          {/* Line and bar chart cards */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            {/* confirmed Appointments bar chart */}
            <div className="bg-[#f4ece6] p-3.5 rounded-lg shadow-md">
              <p className="text-[#132c91] font-semibold">Booked Sessions</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="weekday" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count">
                    {barChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={barColors[index % barColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Area Chart for Appointments */}
            <div className="bg-[#f4ece6] p-3.5 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[#132c91] font-semibold">Appointments Overview</p>
                <select
                  value={areaRange}
                  onChange={e => setAreaRange(e.target.value)}
                  className="bg-white border-0 outline-0 text-[#132c91] text-sm rounded-md p-[2px]"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="3m">Last 3 Months</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={areaChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatShortDate} />
                  <YAxis allowDecimals={false} />
                  <Tooltip labelFormatter={formatShortDate} />
                  <Legend />
                  <Area type="monotone" dataKey="booked" stroke="#27aeef" fill="#27aeef33" name="Booked" />
                  <Area type="monotone" dataKey="completed" stroke="#bdcf32" fill="#bdcf3233" name="Completed" />
                  <Area type="monotone" dataKey="cancelled" stroke="#ea5545" fill="#ea554533" name="Cancelled" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* <div className="bg-[#f4ece6] p-3.5 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <p className="text-[#132c91] font-semibold">Sessions</p>
                <select
                  name=""
                  id=""
                  className="bg-white border-0 outline-0 text-[#132c91] text-sm rounded-md p-[2px]"
                >
                  <option value="" className="text-sm">
                    This Week
                  </option>
                  <option value="" className="text-sm">
                    Last Week
                  </option>
                  <option value="" className="text-sm">
                    This Month
                  </option>
                  <option value="" className="text-sm">
                    Last Month
                  </option>
                  <option value="" className="text-sm">
                    This Semester
                  </option>
                  <option value="" className="text-sm">
                    Last Semester
                  </option>
                </select>
              </div>
            </div> */}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
