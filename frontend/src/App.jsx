import React from 'react'
import { Routes, Route} from 'react-router-dom'

import Navbar from './components/Navbar'

// Landing Pages
import LandingPage from './LandingPage'
import Login from './landing pages/Login'
import Register from './landing pages/Register'

function App() {
  return (
    <div>
      
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </div>
  )
}

export default App
