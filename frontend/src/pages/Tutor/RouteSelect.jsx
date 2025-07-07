import React from "react";
import { Link } from "react-router-dom";

//icons
import * as mdIcons from "react-icons/md";
import * as piIcons from "react-icons/pi";
import * as cgIcons from "react-icons/cg";

const RouteSelect = () => {
  return (
    <div className="space-y-3">
      <Link to="/dashboard" className="block text-white">
        <div className="flex items-center gap-2">
          <mdIcons.MdOutlineDashboard />
          <p className="text-md font-semibold">Dashboard</p>
        </div>
      </Link>
      <Link to="/dashboard/profile" className="block text-white">
        <div className="flex items-center gap-2">
        <cgIcons.CgProfile />
          <p className="text-md font-semibold">Profile</p>
        </div>
      </Link>
      <Link to="/dashboard/schedules" className="block text-white">
        <div className="flex items-center gap-2">
          <mdIcons.MdCalendarMonth />
          <p className="text-md font-semibold">Schedules</p>
        </div>
      </Link>
      <Link to="/dashboard/switch" className="block text-white">
        <div className="flex items-center gap-2">
          <piIcons.PiUserSwitchBold />
          <p className="text-md font-semibold">Switch</p>
        </div>
      </Link>
    </div>
  );
};

export default RouteSelect;
