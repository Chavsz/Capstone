import React from "react";
import RouteSelect from "./RouteSelect";

const Sidebar = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center text-white mb-4">LAV Tutor</h1>
      <RouteSelect />
    </div>
  );
};

export default Sidebar;
