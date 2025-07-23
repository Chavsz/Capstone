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

      <Route
        to="/dashboard"
        selected={selected === "/dashboard"}
        Icon={mdIcons.MdOutlineDashboard }
        title="Dashboard"
        handleSelect={handleSelect}
      />
      <Route
        to="/dashboard/lavroom"
        selected={selected === "/dashboard/lavroom"}
        Icon={mdIcons.MdCalendarMonth  }
        title="Lavroom"
        handleSelect={handleSelect}
      />
      <Route
        to="/dashboard/users"
        selected={selected === "/dashboard/users"}
        Icon={fiIcons.FiUsers }
        title="Users"
        handleSelect={handleSelect}
      />
      <Route
        to="/dashboard/landingadmin"
        selected={selected === "/dashboard/landingadmin"}
        Icon={mdIcons.MdHome }
        title="Landing"
        handleSelect={handleSelect}
      />
      <Route
        to="/dashboard/event"
        selected={selected === "/dashboard/event"}
        Icon={mdIcons.MdOutlineAnnouncement}
        title="Events/Announc"
        handleSelect={handleSelect}
      />
      <Route
        to="/dashboard/switch"
        selected={selected === "/dashboard/switch"}
        Icon={piIcons.PiUserSwitchBold }
        title="Switch"
        handleSelect={handleSelect}
      />
    </div>
  );
};

const Route = ({ to, selected, Icon, title, handleSelect }) => {
  return (
    <Link to={to} className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${selected ? "bg-white text-[#76acf5] shadow" : "hover:bg-[#b3d3ff] text-white shadow-none"}`} onClick={() => handleSelect(to)}>
      <Icon className={`${selected ? "text-[#76acf5]" : ""}`} />
      <p className="text-md font-semibold">{title}</p>
    </Link>
  );
};

export default RouteSelect;
