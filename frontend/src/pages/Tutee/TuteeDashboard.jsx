import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

//component

import { CardsOne } from "../../components/cards";

const TuteeDashboard = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [unratedCount, setUnratedCount] = useState(0);
  const [announcement, setAnnouncement] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function getName() {
    try {
      const response = await axios.get("http://localhost:5000/dashboard", {
        headers: { token: localStorage.getItem("token") },
      });
      setName(response.data.name);
      if (response.data.role) {
        setRole(response.data.role);
        localStorage.setItem("role", response.data.role);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  const getAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/appointment/tutee",
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

  async function fetchUnratedCount() {
    try {
      const response = await axios.get(
        "http://localhost:5000/appointment/tutee/unrated-count",
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setUnratedCount(response.data.unrated_count);
    } catch (err) {
      console.error("Failed to fetch unrated count", err);
    }
  }

  async function fetchAnnouncement() {
    axios
      .get("http://localhost:5000/announcement")
      .then((response) => {
        // Handle array response - get the first announcement
        if (response.data && response.data.length > 0) {
          setAnnouncement(response.data[0]);
        } else {
          setAnnouncement(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching announcement:", error);
      });
  }

  useEffect(() => {
    getName();
    fetchUnratedCount();
    fetchAnnouncement();
    getAppointments();
  }, []);

  const dateToday = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
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

  const completedSessions = appointments.filter(
    (a) => a.status === "completed"
  );

  return (
    <div className="flex-1 flex flex-col bg-white px-6 py-3">
      <div className="flex justify-between items-center">
        {/* <h2 className="text-xl">Welcome, {name}!</h2> */}
        <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>

        {/* Show date today */}
        <p className="text-[13px] font-extralight text-[#696969] gap-2 flex items-center">
          {dateToday}
        </p>
      </div>

      {/* Notices */}

      <div className="flex justify-end items-center">

        <div className="bg-blue-600 cursor-pointer  md:px-8 md:py-2 border-none rounded-3xl  md:text-md text-white hover:bg-blue-700 transition-colors duration-300">
          <Link to="/dashboard/appointment">
            <p>Make an Appointment</p>
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-7 h-full">
        {/* Announcements */}
        <div className="h-full">
          <div className="bg-[#ffffff] p-3.5 rounded-lg border-2 border-[#EBEDEF] h-full flex flex-col">
            <p className="text-blue-600 font-semibold">Announcement</p>
            <div className="mt-2 flex-1">
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
        </div>
        <div className="bg-white p-3.5 rounded-lg border-2 border-[#EBEDEF]">
          <p className="text-blue-600 font-semibold mb-4">
            Confirmed Sessions Today
          </p>
          {nextSessions.length > 0 ? (
            <div className="overflow-x-auto overflow-y-auto h-[150px]">
              <table className="w-full text-[#1a1a1a]">
                <thead>
                  <tr className="border-b border-[#EBEDEF]">
                    <th className="text-left font-bold py-3 px-2">Time</th>
                    <th className="text-left font-bold py-3 px-2">Tutor</th>
                    <th className="text-left font-bold py-3 px-2">Date</th>
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
                        {session.tutor_name || "N/A"}
                      </td>
                      <td className="py-3 px-2">{formatDate(session.date)}</td>
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

      <div className="mt-6 grid grid-cols-3 grid-rows-3 gap-7">
        <div className="row-span-3 col-span-2">
          <div className="bg-white p-3.5 rounded-lg border-2 border-[#EBEDEF] flex-1">
            <p className="text-blue-600 font-semibold">Session History</p>

            {/*Completed Sessions */}
            <div className="overflow-x-auto overflow-y-auto h-[280px]" >
              <table className="w-full text-[#1a1a1a]">
                <thead>
                  <tr className=" border-b border-[#EBEDEF]">
                    <th className="text-left font-bold py-3 px-2">Tutor</th>
                    <th className="text-left font-bold py-3 px-2">Date</th>
                    <th className="text-left font-bold py-3 px-2">Time</th>
                    <th className="text-left font-bold py-3 px-2">Subject</th>
                    <th className="text-left font-bold py-3 px-2">Toipc</th>
                  </tr>
                </thead>

                <tbody>
                  {completedSessions.map((session) => (
                    <tr
                      key={session.appointment_id}
                      className="border-b border-[#EBEDEF]"
                    >
                      <td className="py-3 px-2">
                        {session.tutor_name || "N/A"}
                      </td>
                      <td className="py-3 px-2">{formatDate(session.date)}</td>
                      <td className="py-3 px-2">
                        {formatTime(session.start_time)} -{" "}
                        {formatTime(session.end_time)}
                      </td>
                      <td className="py-3 px-2">{session.subject || "N/A"}</td>
                      <td className="py-3 px-2">{session.topic || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <CardsOne title="Top Tutors" />
        </div>
        <div>
          <CardsOne title="Top Colleges" />
        </div>
        <div>
          <CardsOne title="Top Reasons" />
        </div>
      </div>
    </div>
  );
};

export default TuteeDashboard;
