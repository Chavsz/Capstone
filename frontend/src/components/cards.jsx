import React from "react";

  export const Cards = ({ title, icon, total, latestText, newToday }) => {
  return (
    <div className="bg-[#ffffff] p-3.5 rounded-lg border-2 border-[#EBEDEF]">
      <div className="flex items-center justify-between">
        <p className="text-[#132c91] font-semibold">{title}</p>
        <p className="text-2xl">{icon}</p>
      </div>
      <p className="text-[30px] font-bold pl-4 py-4">{total}</p>
      <div className="flex gap-2">
        <p className="text-[13.5px] text-[#1fb82c] font-bold">{newToday}</p>
        <p className="text-[13.5px] text-[#A0A0A0]"> {latestText}</p>
      </div>
    </div>
  );
};

export const CardsOne = ({ title, children}) => {
  return (
    <div className="bg-[#ffffff] p-3.5 rounded-lg border-2 border-[#EBEDEF]">
      <p className="text-[#132c91] font-semibold">{title}</p>
      {children && <div>{children}</div>}
      
    </div>
  );
};

export const LavRoomCards = ({ startTime, endTime, room, tutor, student }) => {
  return (
    <div className="bg-[#ffffff] p-3.5 rounded-lg shadow-md">
      <p className="text-[#132c91] font-semibold">Start: {startTime} - End: {endTime}</p>

      <div className="flex justify-between  flex-col border-t border-[#d1d1d1] mt-2 p-1.5">
        <p>Room: {room}</p>
        <p>Tutor: {tutor}</p>
        <p>Student: {student}</p>
      </div>

    </div>
  );
};


