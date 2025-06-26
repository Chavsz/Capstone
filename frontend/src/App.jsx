import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Public Pages
import LandingPage from './LandingPage'



function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
        

          
        </Routes>
      </Router>
    </div>
  )
}

export default App
