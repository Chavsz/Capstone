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
  PieChart,
  Pie,
} from "recharts";
import * as fiIcons from "react-icons/fi";

// Components
import { Cards } from "../../components/cards";

function Dashboard() {
  const [name, setName] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [appointments, setAppointments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [evaluatedAppointments, setEvaluatedAppointments] = useState([]);
  const [areaRange, setAreaRange] = useState("7d");
  const [collegeData, setCollegeData] = useState([]);

  const responses = (response) => {
    try {
      response;
    } catch (err) {
      console.error(err.message);
    }
  };

  async function getName() {
    const response = await axios.get("http://localhost:5000/dashboard", {
      headers: { token: localStorage.getItem("token") },
    });
    setName(response.data.name);
    if (response.data.role) {
      setRole(response.data.role);
      localStorage.setItem("role", response.data.role);
    }

    return responses(response);
  }

  async function getAppointments() {
    const response = await axios.get(
      "http://localhost:5000/dashboard/appointment/admin",
      {
        headers: { token: localStorage.getItem("token") },
      }
    );
    setAppointments(response.data);

    return responses(response);
  }

  async function getFeedbacks() {
    const response = await axios.get(
      "http://localhost:5000/appointment/feedback/admin",
      {
        headers: { token: localStorage.getItem("token") },
      }
    );
    setFeedbacks(response.data);

    return responses(response);
  }

  async function getEvaluatedAppointments() {
    const response = await axios.get(
      "http://localhost:5000/appointment/evaluated/admin",
      {
        headers: { token: localStorage.getItem("token") },
      }
    );
    setEvaluatedAppointments(response.data);
    return responses(response);
  }

  async function getCollegeData() {
    try {
      const response = await axios.get(
        "http://localhost:5000/dashboard/students",
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setCollegeData(response.data);
      return responses(response);
    } catch (error) {
      console.error("Error fetching college data:", error);
      setCollegeData([]);
    }
  }

  useEffect(() => {
    getName();
    getAppointments();
    getFeedbacks();
    getEvaluatedAppointments();
    getCollegeData();
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
  const dateSet = new Set(filteredAppointments.map((a) => a.date));
  const sortedDates = Array.from(dateSet).sort();
  // Build data for each date
  const areaChartData = sortedDates.map((date) => {
    const booked = filteredAppointments.filter((a) => a.date === date).length;
    const completed = filteredAppointments.filter(
      (a) => a.date === date && a.status === "completed"
    ).length;
    const cancelled = filteredAppointments.filter(
      (a) => a.date === date && a.status === "cancelled"
    ).length;
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

  // Date today
  const dateToday = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const completedSessionsToday = completedAppointments.filter(
    (a) => formatDate(a.date) === dateToday
  );
  const evaluatedSessionsToday = evaluatedAppointments.filter(
    (a) => formatDate(a.date) === dateToday
  );
  const bookedSessionsToday = appointments.filter(
    (a) => formatDate(a.date) === dateToday
  );
  const cancelledSessionsToday = cancelledAppointments.filter(
    (a) => formatDate(a.date) === dateToday
  );

  // Prepare data for pie chart: students by college
  const collegeMapping = {
    "College of Engineering": "COE",
    "College of Arts and Social Sciences": "CASS",
    "College of Computer Studies": "CCS",
    "College of Education": "CED",
    "College of Health and Sciences": "CHS",
    "College of Economics, Business, and Accountancy": "CEBA",
    "College of Science and Mathematics": "CSM",
  };

  const collegeColors = [
    "#FF6B6B", // COE - Red
    "#4ECDC4", // CASS - Teal
    "#45B7D1", // CCS - Blue
    "#96CEB4", // COED - Green
    "#FFEAA7", // CHS - Yellow
    "#DDA0DD", // CEBA - Plum
    "#98D8C8", // CSM - Mint
  ];

  // Process college data for pie chart
  let pieChartData = [];

  pieChartData = collegeData.map((item, index) => {
    const shortName = collegeMapping[item.college] || item.college;
    return {
      name: shortName,
      value: parseInt(item.student_count) || 0,
      color: collegeColors[index % collegeColors.length],
    };
  });

  return (
    <div className="flex">
      <div className="min-h-screen flex-1 flex flex-col bg-[#ffffff] p-6">
        <div className="">
          <div className="flex justify-between items-center">
            {/* <h2 className="text-[24px] font-bold text-[#132c91]">
              Welcome, {name}!
            </h2> */}

            <h1 className="text-[24px] font-bold text-blue-600">Dashboard</h1>

            {/* Show date today */}
            <p className="text-[13px] font-extralight text-[#696969] flex items-center gap-2">
              {dateToday}
            </p>
          </div>

          {/* Admin Dashboard Cards  */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-6">
            {/* Sessions Card */}
            <Cards
              title="Sessions"
              icon={<fiIcons.FiCalendar />}
              total={completedCount}
              newToday={
                completedSessionsToday.length === 0
                  ? ""
                  : completedSessionsToday.length
              }
              latestText={
                completedSessionsToday.length === 0
                  ? "No completed sessions today"
                  : "Completed Sessions Today"
              }
            />

            {/* Evaluations Card */}
            <Cards
              title="Evaluations"
              icon={<fiIcons.FiCheckSquare />}
              total={feedbackCount}
              newToday={
                evaluatedSessionsToday.length === 0
                  ? ""
                  : evaluatedSessionsToday.length
              }
              latestText={
                evaluatedSessionsToday.length === 0
                  ? "No evaluations today"
                  : "Evaluations Today"
              }
            />

            {/* Student Request Card */}
            <Cards
              title="Tutee Request"
              icon={<fiIcons.FiUser />}
              total={appointments.length}
              newToday={
                bookedSessionsToday.length === 0
                  ? ""
                  : bookedSessionsToday.length
              }
              latestText={
                bookedSessionsToday.length === 0
                  ? "No bookings today"
                  : "Bookings Today"
              }
            />

            {/* Cancellations Card */}
            <div className="bg-[#ffffff] p-3.5 rounded-lg border-2 border-[#EBEDEF] hover:translate-y-[-5px] transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-blue-600 font-semibold">Cancellations</p>
                <p className="text-2xl">
                  <fiIcons.FiCalendar />
                </p>
              </div>
              <p className="text-[30px] font-bold pl-4 py-4 text-gray-600">
                {cancelledCount}
              </p>
              <div className="flex gap-2">
                <p className="text-[13.5px] text-[#ad0d0d] font-bold">
                  {cancelledSessionsToday.length === 0
                    ? ""
                    : cancelledSessionsToday.length}
                </p>
                <p className="text-[13.5px] text-[#A0A0A0]">
                  {" "}
                  {cancelledSessionsToday.length === 0
                    ? "No cancelled sessions today"
                    : "Cancelled Sessions Today"}
                </p>
              </div>
            </div>
          </div>

          {/* Line and bar chart cards */}
          <div className="mt-6 grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4 ">
            {/* confirmed Appointments bar chart */}
            <div className="bg-[#ffffff] p-3.5 rounded-lg border-2 border-[#EBEDEF] hover:translate-y-[-5px] transition-all duration-300">
              <p className="text-blue-600 font-semibold">Confirmed Sessions</p>
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
            <div className="bg-[#ffffff] p-3.5 rounded-lg border-2 border-[#EBEDEF] hover:translate-y-[-5px] transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <p className="text-blue-600 font-semibold">
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
              <ResponsiveContainer width="100%" height={250}>
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

          {/* Pie Chart for student from each college */}
          <div className="mt-6 w-full">
            <div className="bg-[#ffffff] w-1/2 p-3.5 rounded-lg border-2 border-[#EBEDEF] hover:translate-y-[-5px] transition-all duration-300">
              <p className="text-blue-600 font-semibold mb-4">
                Students by College
              </p>
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  <p>No college data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
