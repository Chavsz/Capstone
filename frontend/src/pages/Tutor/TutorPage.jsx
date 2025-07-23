import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

// components
import Sidebar from "./Sidebar";

// Tutor Pages
import TutorDashboard from "./TutorDashboard";
import Profile from "./Profile";
import Schedules from "./Schedule";
import Switch from "./Switch";

function TutorPage({ setAuth }) {
  return (
    <div className="grid grid-cols-[240px_1fr] bg-[#76acf5]">
      <div>
        <Sidebar setAuth={setAuth} />
      </div>
      <div className="">
        <Routes>
          <Route
            exact
            path="/"
            element={<TutorDashboard setAuth={setAuth} />}
          />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/schedules" element={<Schedules />} />
          <Route exact path="/switch" element={<Switch />} />
        </Routes>
      </div>
    </div>
  );
}

export default TutorPage;
