import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

// components
import Sidebar from "./Sidebar";

// Tutee Pages
import TuteeDashboard from "./TuteeDashboard";
import Profile from "./Profile";
import Request from "./Request";
import Schedules from "./Schedules";
import Switch from "./Switch";

function TuteePage({ setAuth }) {
  return (
    <div className="grid gap-4 grid-cols-[200px_1fr] bg-[#76acf5]">
      <div>
        <Sidebar />
      </div>
      <div className="">
        <Routes>
          <Route
            exact
            path="/"
            element={<TuteeDashboard setAuth={setAuth} />}
          />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/request" element={<Request />} />
          <Route exact path="/schedules" element={<Schedules />} />
          <Route exact path="/switch" element={<Switch />} />
        </Routes>
      </div>
    </div>
  );
}

export default TuteePage;
