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

export const CardsOne = ({ title, children }) => {
  return (
    <div className="bg-[#f4ece6] p-3.5 rounded-lg shadow-md">
      <p className="text-[#132c91] font-semibold">{title}</p>
      {children && <div>{children}</div>}
    </div>
  );
};

export const LavRoomCards = ({ startTime, endTime, room, tutor, student }) => {
  return (
    <div className="bg-[#f4ece6] p-3.5 rounded-lg shadow-md">
      <p className="text-[#132c91] font-semibold">Start: {startTime} - End: {endTime}</p>

      <div className="flex justify-between  flex-col border-t border-[#d1d1d1] mt-2 p-1.5">
        <p>Room: {room}</p>
        <p>Tutor: {tutor}</p>
        <p>Student: {student}</p>
      </div>

    </div>
  );
};

export const Announcement = ({ title, announcement }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>

      {announcement ? (
        <div>
          
          {announcement.announcement_content ? (
            <p className="text-gray-700 mb-4">{announcement.announcement_content}</p>
          ) : (
            <p className="text-gray-600">No content available</p>
          )}
        </div>
      ) : (
        <p className="text-gray-600">No announcement found.</p>
      )}
    </div>
  );
};


