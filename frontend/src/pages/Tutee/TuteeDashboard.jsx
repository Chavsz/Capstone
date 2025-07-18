import React, { useState, useEffect } from "react";
import axios from "axios";

// Components
import { CardsOne } from "../../components/cards";

const TuteeDashboard = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "");

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

  useEffect(() => {
    getName();
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
          <div className="row-span-2">
            <CardsOne title="Announcements" />
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
