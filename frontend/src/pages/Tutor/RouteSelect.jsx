import React, { useState } from "react";
import { Link } from "react-router-dom";

//icons
import * as mdIcons from "react-icons/md";
import * as piIcons from "react-icons/pi";
import * as cgIcons from "react-icons/cg";

const RouteSelect = () => {

  const [selected, setSelected] = useState(window.location.pathname);

  const handleSelect = (to) => {
    setSelected(to);
  };

  return (
    <div className="space-y-3">

      <Route
        to="/dashboard"
        selected={selected === "/dashboard"}
        Icon={mdIcons.MdOutlineDashboard }
        title="Dashboard"
        handleSelect={handleSelect}
      />
      <Route
        to="/dashboard/profile"
        selected={selected === "/dashboard/profile"}
        Icon={cgIcons.CgProfile  }
        title="Profile"
        handleSelect={handleSelect}
      />
      <Route
        to="/dashboard/schedules"
        selected={selected === "/dashboard/schedules"}
        Icon={mdIcons.MdCalendarMonth }
        title="Schedules"
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
    <Link to={to} className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${selected ? "bg-white text-[#76acf5] shadow" : "hover:bg-[#b3d3ff]  text-white shadow-none"}`} onClick={() => handleSelect(to)}>
      <Icon className={`${selected ? "text-[#76acf5]" : ""}`} />
      <p className="text-md font-semibold">{title}</p>
    </Link>
  );
};

export default RouteSelect;
