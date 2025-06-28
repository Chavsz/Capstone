import React from 'react'
import Sidebar from "../AdminnStaff/Sidebar";

function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <section id="ourtutors" className="min-h-screen flex-1 flex items-center justify-center bg-white">
        <h1 className="text-3xl font-bold">This is the Admin Dashboard Page</h1>
      </section>
    </div>
  )
}

export default Dashboard
