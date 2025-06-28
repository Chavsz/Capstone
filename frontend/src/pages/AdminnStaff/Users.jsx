import React from 'react'
import Sidebar from "../AdminnStaff/Sidebar";

function Users() {
  return (
    <div className="flex">
      <Sidebar />
      <section id="ourtutors" className="min-h-screen flex-1 flex items-center justify-center bg-white">
        <h1 className="text-3xl font-bold">This is the Users page</h1>
      </section>
    </div>
  )
}

export default Users
