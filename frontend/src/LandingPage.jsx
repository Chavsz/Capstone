import React from 'react'
import Navbar from './landing/Navbar' 
import Home from './landing/Home' 
import About from './landing/About' 
import Events from './landing/Events' 
import OurTutors from './landing/OurTutors' 
import ContactUs from './landing/ContactUs' 



function LandingPage() {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        {/* Landing content goes here */}
     <Home />
     <About />
     <Events/>
     <OurTutors />
     <ContactUs />
      </div>
    </div>
  )
}

export default LandingPage
