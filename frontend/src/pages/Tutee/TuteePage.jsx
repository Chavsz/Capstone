import React from "react";
import { Routes, Route } from "react-router-dom";

// components
import Sidebar from "./Sidebar";
import Header from "./Header";

// Tutee Pages
import TuteeDashboard from "./TuteeDashboard";
import Profile from "./Profile";
import Schedules from "./Schedules";
import Appointment from "./Appointment";

function TuteePage({ setAuth }) {
  return (
    <div className="grid grid-cols-[80px_1fr] md:grid-cols-[240px_1fr] transition-width duration-300 bg-white min-h-screen">
      <div>
        <Sidebar setAuth={setAuth} />
      </div>
      <div className="flex flex-col">
        <Header />
        <div className="flex-1">
        <Routes>
          <Route
            exact
            path="/"
            element={<TuteeDashboard setAuth={setAuth} />}
          />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/appointment" element={<Appointment />} />
            <Route exact path="/schedules" element={<Schedules />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default TuteePage;
