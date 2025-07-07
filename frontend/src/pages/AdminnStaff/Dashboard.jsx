import React, { useState, useEffect } from "react";
import axios from "axios";

import * as fiIcons from "react-icons/fi";

// Components
import { Cards, CardsOne } from "../../components/cards";

function Dashboard({ setAuth }) {
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
            <h2 className="text-[24px] font-bold text-[#132c91]">
              Welcome, {name}!
            </h2>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              onClick={(e) => logout(e)}
            >
              <fiIcons.FiLogOut />
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
            <div className="bg-[#f4ece6] p-3.5 rounded-lg shadow-md">
              <p className="text-[#132c91] font-semibold">Booked Sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
