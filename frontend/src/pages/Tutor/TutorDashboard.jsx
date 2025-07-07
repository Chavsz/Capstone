import React, { useState, useEffect } from "react";
import axios from "axios";

//icons
import * as fiIcons from "react-icons/fi";

// Components
import { Cards, CardsOne } from "../../components/cards";

const TutorDashboard = ({ setAuth }) => {
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
    <div className="flex">
      <div className="min-h-screen flex-1 flex flex-col bg-white p-6">
        <div className="">
          <div className="flex justify-between items-center">
            <h2 className="ttext-[24px] font-bold text-[#132c91]">
              Welcome, {name}!
            </h2>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
              onClick={(e) => logout(e)}
            >
              Logout
            </button>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-7 mt-6">
            <Cards title="Sessions" icon={<fiIcons.FiCalendar />} count={10} />
            <Cards
              title="Evaluations"
              icon={<fiIcons.FiCheckSquare />}
              count={10}
            />
            <Cards title="Tutee Request" icon={<fiIcons.FiUser />} count={10} />
            <Cards
              title="Cancellations"
              icon={<fiIcons.FiCalendar />}
              count={10}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 grid-rows-2 gap-7">
            <div className="row-span-2">
              <CardsOne title="Sessions" />
            </div>
            <div>
              <CardsOne title="Next Sessions" />
            </div>
            <div>
              <CardOne title="Announcements" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
