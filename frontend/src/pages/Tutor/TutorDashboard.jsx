import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-600">Tutor Dashboard</h1>
        <div className="text-center space-y-4">
          <h2 className="text-xl">Welcome, {name}!</h2>
          {role && <h3 className="text-lg text-gray-600">Role: {role}</h3>}
          <div className="mt-6">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
              onClick={(e) => logout(e)}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;