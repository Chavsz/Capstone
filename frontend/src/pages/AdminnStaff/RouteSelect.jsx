import React from "react";
import { Link } from "react-router-dom";

import * as mdIcons from "react-icons/md";
import * as fiIcons from "react-icons/fi";
import * as piIcons from "react-icons/pi";


const RouteSelect = () => {
  return (
    <div className="space-y-3">
      <Link to="/dashboard" className="block text-white">
        <div className="flex items-center gap-2">
          <mdIcons.MdOutlineDashboard />
          <p className="text-md font-semibold">Dashboard</p>
        </div>
      </Link>
      <Link to="/dashboard/lavroom" className="block text-white">   
        <div className="flex items-center gap-2">
          <mdIcons.MdCalendarMonth   />
          <p className="text-md font-semibold">Lavroom</p>
        </div>
      </Link>
      <Link to="/dashboard/users" className="block text-white">
        <div className="flex items-center gap-2">
        <fiIcons.FiUsers />
          <p className="text-md font-semibold">Users</p>
        </div>
      </Link>
      <Link to="/dashboard/landingadmin" className="block text-white">
        <div className="flex items-center gap-2">
          <mdIcons.MdHome />
          <p className="text-md font-semibold">Landing</p>
        </div>
      </Link>
      <Link to="/dashboard/event" className="block text-white">
        <div className="flex items-center gap-2">
          <piIcons.PiUserSwitchBold />
          <p className="text-md font-semibold">Events/Announcements</p>
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
