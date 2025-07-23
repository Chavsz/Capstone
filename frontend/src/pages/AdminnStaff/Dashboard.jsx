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
} from "recharts";
import * as fiIcons from "react-icons/fi";

// Components
import { Cards, CardsOne } from "../../components/cards";

function Dashboard() {
  const [name, setName] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [appointments, setAppointments] = useState([]);

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

  useEffect(() => {
    getName();
    getAppointments();
  }, []);

  // Helper: Get weekday name from date string
  function getWeekday(dateString) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(dateString);
    return days[date.getDay()];
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
            <Cards title="Sessions" icon={<fiIcons.FiCalendar />} count={completedCount}/>
            <Cards
              title="Evaluations"
              icon={<fiIcons.FiCheckSquare />}
              count={10}
            />
            <Cards title="Tutee Request" icon={<fiIcons.FiUser />} count={10} />
            <Cards
              title="Cancellations"
              icon={<fiIcons.FiCalendar />}
              count={cancelledCount}
            />
          </div>

          {/* Line and bar chart cards */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="bg-[#f4ece6] p-3.5 rounded-lg shadow-md">
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
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
