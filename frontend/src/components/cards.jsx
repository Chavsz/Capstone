import React from "react";

export const Cards = ({ title, icon, count }) => {
  return (
    <div className="bg-[#f4ece6] p-3.5 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-[#132c91] font-semibold">{title}</p>
        <p className="text-2xl">{icon}</p>
      </div>
      <p className="text-2xl font-bold">{count}</p>
      <div className="border-t border-[#76acf5] mt-2 p-1.5">
        <p className="text-[13.5px]">Lorem ipsum dolor</p>
      </div>
    </div>
  );
};

export const CardCharts = ({ title }) => {
  return (
    <div className="bg-[#f4ece6] p-3.5 rounded-lg shadow-md">
      <p className="text-[#132c91] font-semibold">{title}</p>
    </div>
  );
};
