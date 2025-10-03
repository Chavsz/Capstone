import React, { useState, useEffect } from "react";
import axios from "axios";
import * as fiIcons from "react-icons/fi";

// Components
import { Cards } from "../../components/cards";
import {
  CollegePieChart,
  SessionBarChart,
  AppointmentsAreaChart,
} from "../../components/graphs";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [evaluatedAppointments, setEvaluatedAppointments] = useState([]);
  const [collegeData, setCollegeData] = useState([]);

  const responses = (response) => {
    try {
      response;
    } catch (err) {
      console.error(err.message);
    }
  };

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

  // async function getFeedbacks() {
  //   const response = await axios.get(
  //     "http://localhost:5000/appointment/feedback/admin",
  //     {
  //       headers: { token: localStorage.getItem("token") },
  //     }
  //   );
  //   setFeedbacks(response.data);

  //   return responses(response);
  // }

  // async function getEvaluatedAppointments() {
  //   const response = await axios.get(
  //     "http://localhost:5000/appointment/evaluated/admin",
  //     {
  //       headers: { token: localStorage.getItem("token") },
  //     }
  //   );
  //   setEvaluatedAppointments(response.data);
  //   return responses(response);
  // }

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
    getAppointments();
    // getFeedbacks();
    // getEvaluatedAppointments();
    getCollegeData();
  }, []);

  // Total number of cancelled appointments
  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled"
  );

  //Total number of completed appointments
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  );

  //Total number of feedbacks
  const feedbackCount = feedbacks.length;

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

  return (
    <div className="flex">
      <div className="min-h-screen flex-1 flex flex-col bg-[#ffffff] p-6">
        <div className="">
          <div className="flex justify-between items-center">

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
              total={completedAppointments.length}
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
                {cancelledAppointments.length}
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
              <SessionBarChart appointmentsData={appointments} />
            </div>

            {/* Area Chart for Appointments */}
            <div className="bg-[#ffffff] p-3.5 rounded-lg border-2 border-[#EBEDEF] hover:translate-y-[-5px] transition-all duration-300">
              <AppointmentsAreaChart appointmentsData={appointments} />
            </div>
          </div>

          {/* Pie Chart for student from each college */}
          <div className="mt-6 w-full">
            <div className="bg-[#ffffff] w-1/2 p-3.5 rounded-lg border-2 border-[#EBEDEF] hover:translate-y-[-5px] transition-all duration-300">
              <CollegePieChart collegeData={collegeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
