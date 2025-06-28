import React from "react";
import Sidebar from './Sidebar';

const Landing = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="content" style={{ marginLeft: '220px', padding: '20px' }}>
        <h1>THIS is the Users PAGE</h1>
        <p>Manage users and their permissions here.</p>
      </div>
    </div>
  );
};

export default Landing;
