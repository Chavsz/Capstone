import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as mdIcons from "react-icons/md";
import * as piIcons from "react-icons/pi";

const RouteSelect = () => {
  const [selected, setSelected] = useState(window.location.pathname);
  const [canSwitchToTutor, setCanSwitchToTutor] = useState(
    typeof window !== "undefined" && localStorage.getItem("canSwitchToTutor") === "true"
  );

  useEffect(() => {
    const updateFlag = () => {
      const val = typeof window !== "undefined" && localStorage.getItem("canSwitchToTutor") === "true";
      setCanSwitchToTutor(Boolean(val));
    };

    // Update when role or capability flags change
    const onRoleChanged = () => updateFlag();
    const onCanSwitchUpdated = () => updateFlag();

    window.addEventListener("roleChanged", onRoleChanged);
    window.addEventListener("canSwitchUpdated", onCanSwitchUpdated);

    // Also run once on mount
    updateFlag();

    return () => {
      window.removeEventListener("roleChanged", onRoleChanged);
      window.removeEventListener("canSwitchUpdated", onCanSwitchUpdated);
    };
  }, []);

  const handleSelect = (to) => {
    setSelected(to);
  };

  return (
    <div className="space-y-1">
      <p className="text-[13px] font-extralight text-[#696969] hidden md:block">MENU</p>

      <Route
        to="/dashboard"
        selected={selected === "/dashboard"}
        Icon={mdIcons.MdOutlineDashboard}
        title="Dashboard"
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
      {canSwitchToTutor && (
        <Route
          to="/dashboard/switch"
          selected={selected === "/dashboard/switch"}
          Icon={piIcons.PiUserSwitchBold}
          title="Switch"
          handleSelect={handleSelect}
        />
      )}
    </div>
  );
};

const Route = ({ to, selected, Icon, title, handleSelect }) => {
  return (
    <Link
      to={to}
      className={`flex items-center md:justify-start justify-center gap-2 w-full rounded px-2 py-2 md:py-1.5 md:text-sm text-1xl transition-all duration-300 ${
        selected
          ? "bg-[#e0ecfd] text-blue-600 shadow"
          : "hover:bg-[#e0ecfd] text-[#696969] shadow-none"
      }`}
      onClick={() => handleSelect(to)}  
    >
      <Icon className={`${selected ? "text-blue-600" : ""}`} />
      <p className="text-md font-semibold hidden md:block">{title}</p>
    </Link>
  );
};

export default RouteSelect;
