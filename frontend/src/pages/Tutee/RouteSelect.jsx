import React, { useState } from "react";
import { Link } from "react-router-dom";

import * as mdIcons from "react-icons/md";
import * as fiIcons from "react-icons/fi";
import * as piIcons from "react-icons/pi";

const RouteSelect = () => {
  const [selected, setSelected] = useState(window.location.pathname);

  const handleSelect = (to) => {
    setSelected(to);
  };

  return (
    <div className="space-y-1">
      <p className="text-[13px] font-extralight text-[#696969]">MENU</p>

      <Route
        to="/dashboard"
        selected={selected === "/dashboard"}
        Icon={mdIcons.MdOutlineDashboard}
        title="Dashboard"
        handleSelect={handleSelect}
      />
      <Route
        to="/dashboard/profile"
        selected={selected === "/dashboard/profile"}
        Icon={fiIcons.FiUsers}
        title="Profile"
        handleSelect={handleSelect}
      />
      <Route
        to="/dashboard/appointment"
        selected={selected === "/dashboard/appointment"}
        Icon={mdIcons.MdCalendarMonth}
        title="Appointment"
        handleSelect={handleSelect}
      />
      <Route
        to="/dashboard/schedules"
        selected={selected === "/dashboard/schedules"}
        Icon={mdIcons.MdCalendarMonth}
        title="Schedules"
        handleSelect={handleSelect}
      />
      <Route
        to="/dashboard/switch"
        selected={selected === "/dashboard/switch"}
        Icon={piIcons.PiUserSwitchBold}
        title="Switch"
        handleSelect={handleSelect}
      />
    </div>
  );
};

const Route = ({ to, selected, Icon, title, handleSelect }) => {
  return (
    <Link
      to={to}
      className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
        selected
          ? "bg-[#e0ecfd] text-[#132c91] shadow"
          : "hover:bg-[#e0ecfd] text-[#696969] shadow-none"
      }`}
      onClick={() => handleSelect(to)}  
    >
      <Icon className={`${selected ? "text-[#132c91]" : ""}`} />
      <p className="text-md font-semibold">{title}</p>
    </Link>
  );
};

export default RouteSelect;
