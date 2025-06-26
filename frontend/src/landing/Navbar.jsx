import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
          e-SKEDLAV
        </div>
        <div className="space-x-6">
          <a href="#home" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
          <a href="#events" className="text-gray-700 hover:text-blue-600">Events</a>
          <a href="#ourtutors" className="text-gray-700 hover:text-blue-600">Our Tutors</a>
          <a href="#contactus" className="text-gray-700 hover:text-blue-600">Contact Us</a>
          <Link to="./auth/login" className="text-gray-700 hover:text-blue-600">Login</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
