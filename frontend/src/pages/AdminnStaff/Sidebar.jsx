import React from "react";
import { Link } from "react-router-dom"; 

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-60 h-screen p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h2>
      <ul>
        <li className="mb-4">
          <Link to="/asdashboard" className="text-white hover:bg-gray-700 p-2 block rounded">Dashboard</Link>
        </li>
        <li className="mb-4">
          <Link to="/lavroom" className="text-white hover:bg-gray-700 p-2 block rounded">Lavroom</Link>
        </li>
        <li className="mb-4">
          <Link to="/users" className="text-white hover:bg-gray-700 p-2 block rounded">Users</Link>
        </li>
        <li className="mb-4">
          <Link to="/landing" className="text-white hover:bg-gray-700 p-2 block rounded">Landing</Link>
        </li>
        <li className="mb-4">
          <Link to="/switch" className="text-white hover:bg-gray-700 p-2 block rounded">Switch</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
