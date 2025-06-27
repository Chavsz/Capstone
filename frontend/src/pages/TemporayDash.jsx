import React, { useState, useEffect } from "react";
import axios from "axios";

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
    setAuth(false);
  };

  return (
    <>
      <div className="flex flex-col items-center h-screen">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <h2 className="text-lg">Welcome {name}</h2>
        {role && <h3 className="text-lg">Your role: {role}</h3>}
        <button
          className="bg-red-500 text-white p-2 rounded-md"
          onClick={(e) => logout(e)}
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default Dashboard;
