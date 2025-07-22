import React, { useState, useEffect } from "react";
import axios from "axios";

// Components
import { CardsOne } from "../../components/cards";
import { Announcement } from "../../components/cards";

const TuteeDashboard = ({ setAuth }) => {
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
      const response = await axios.get("http://localhost:5000/appointment/tutee/unrated-count", {
        headers: { token: localStorage.getItem("token") },
      });
      setUnratedCount(response.data.unrated_count);
    } catch (err) {
      console.error("Failed to fetch unrated count", err);
    }
  }

  useEffect(() => {
    getName();
    fetchUnratedCount();
     axios.get('http://localhost:5000/announcement')
    .then((response) => {
      console.log('Fetched announcement:', response.data); // Debugging line
      setAnnouncement(response.data);
    })
    .catch((error) => {
      console.error('Error fetching announcement:', error);
    });
  }, []);

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuth(false);
  };

  return (
    <div className="min-h-screen flex-1 flex flex-col bg-white p-6">
      <div className="">
        <div className="flex justify-between items-center">
          <h2 className="text-xl">Welcome, {name}!</h2>

          <button
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
            onClick={(e) => logout(e)}
          >
            Logout
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 grid-rows-2 gap-7">
        {/* Announcements */}
          <div className="row-span-2">
            <CardsOne title="Announcements">
              {unratedCount > 0 && (
                <div className="text-red-600 font-semibold mt-2">
                  You have {unratedCount} appointment{unratedCount > 1 ? 's' : ''} to rate.
                </div>
              )}
            </CardsOne> 
          </div>
          <div>
           <Announcement title="Announcement" announcement={announcement} />
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
