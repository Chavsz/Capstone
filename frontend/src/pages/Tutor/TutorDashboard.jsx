import React, { useState, useEffect } from "react";
import axios from "axios";

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

  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  );

  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled" || a.status === "declined"
  );

  const requestAppointments = appointments.filter(
    (a) => a.status === "pending"
  );

  return (
    <div className="flex">
      <div className="min-h-screen flex-1 flex flex-col bg-white p-6">
        <div className="">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="ttext-[24px] font-bold text-[#132c91]">
                Welcome, {name}!
              </h2>
              {/* Show average rating if available */}
              <div className="mt-2">
                {avgRating !== null ? (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">
                      Your Rating:
                    </span>
                    <StarDisplay value={avgRating} />
                  </div>
                ) : (
                  <span className="text-gray-500">No ratings yet</span>
                )}
              </div>
            </div>
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
              count={requestAppointments.length}
            />
            <Cards
              title="Cancellations"
              icon={<fiIcons.FiCalendar />}
              count={cancelledAppointments.length}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 grid-rows-2 gap-7">
            <div className="row-span-2">
              <CardsOne title="Sessions" />
            </div>

            {/* Announcements */}
            <div className=" h-full">
              <div className="bg-[#f4ece6] p-3.5 rounded-lg shadow-md h-full flex flex-col">
                <p className="text-[#132c91] font-semibold">Announcement</p>
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

            <div>
              <CardsOne title="Next Sessions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
