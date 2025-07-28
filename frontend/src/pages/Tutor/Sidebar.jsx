import React from "react";
import RouteSelect from "./RouteSelect";

import * as fiIcons from "react-icons/fi";

const Sidebar = ({ setAuth }) => {
  //logout
  const logout = (e) => {
    e.preventDefault();
    setAuth(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // window.location.href = "/";
  };
  return (
    <div className="p-4 sticky top-0">
      <div className="top-4 h-[calc(100vh-32px-50px)]">
        <h1 className="text-2xl font-bold text-center text-[#132c91] mb-9">LAV</h1>

        <RouteSelect />
      </div>

      <div>
        <button
          className="flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 cursor-pointer text-sm hover:bg-[#e0ecfd] text-[#696969] shadow-none "
          onClick={(e) => logout(e)}
        >
          <fiIcons.FiLogOut /> <p className="text-md font-semibold">Log out</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
