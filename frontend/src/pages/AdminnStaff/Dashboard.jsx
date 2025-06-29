import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      <section className="min-h-screen flex-1 flex flex-col items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-purple-600">Admin Dashboard</h1>
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
      </section>
    </div>
  );
}

export default Dashboard;
