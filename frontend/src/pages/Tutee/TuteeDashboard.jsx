import React, { useState, useEffect } from "react";
import axios from "axios";

// Components
import { CardsOne } from "../../components/cards";

const TuteeDashboard = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [unratedCount, setUnratedCount] = useState(0);
  const [announcement, setAnnouncement] = useState(null);

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
        setAnnouncement(response.data);
      })
      .catch((error) => {
        console.error("Error fetching announcement:", error);
      });
  }

  useEffect(() => {
    getName();
    fetchUnratedCount();
    fetchAnnouncement();
  }, []);

  return (
    <div className="min-h-screen flex-1 flex flex-col bg-white p-6">
      <div className="">
        <div className="flex justify-between items-center">
          {/* <h2 className="text-xl">Welcome, {name}!</h2> */}
          <h1 className="text-[24px] font-bold text-[#132c91]">Dashboard</h1>
        </div>

        {/* Notices */}
        <div>
          <CardsOne title="Notifications">
            {unratedCount > 0 && (
              <div className="text-red-600 font-semibold mt-2">
                You have {unratedCount} appointment{unratedCount > 1 ? "s" : ""}{" "}
                to rate.
              </div>
            )}
          </CardsOne>
        </div>

        <div className="mt-6 grid grid-cols-2 grid-rows-2 gap-7 h-full">
          {/* Announcements */}
          <div className="row-span-2 h-full">
            <div className="bg-[#ffffff] p-3.5 rounded-lg border-2 border-[#EBEDEF] h-full flex flex-col">
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
            <CardsOne title="Book an Appointment" />
          </div>
          <div>
            <CardsOne title="Next Sessions" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 grid-rows-3 gap-7">
          <div className="row-span-3">
            <CardsOne title="Booking History" />
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
    </div>
  );
};

export default TuteeDashboard;
