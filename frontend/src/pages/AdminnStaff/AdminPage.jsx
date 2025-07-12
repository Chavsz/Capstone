import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Landing from "./Landing";
import Lavroom from "./Lavroom";
import Switch from "./Switch";
import Users from "./Users";
import Event from "./Event";

function AdminPage({ setAuth }) {
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
            element={<Dashboard setAuth={setAuth} />}
          />
          <Route exact path="/landingadmin" element={<Landing />} />
          <Route exact path="/lavroom" element={<Lavroom />} />
          <Route exact path="/switch" element={<Switch />} />
          <Route exact path="/event" element={<Event />} />
          <Route exact path="/users" element={<Users />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminPage;
