import React from "react";
import Sidebar from './Sidebar';

const Lavroom = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="content" style={{ marginLeft: '220px', padding: '20px' }}>
        <h1>THIS is the Lavroom PAGE</h1>
        <p>Manage your Lavroom settings here.</p>
      </div>
    </div>
  );
};

export default Lavroom;
