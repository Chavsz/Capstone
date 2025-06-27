import React from "react";

import Home from "./landing pages/Home";
import About from "./landing pages/About";
import Events from "./landing pages/Events";
import OurTutors from "./landing pages/OurTutors";
import ContactUs from "./landing pages/ContactUs";

const LandingPage = () => {
  return (
    <>
      <div className="min-h-screen flex-col">
        <div id="home-section">
          <Home />
        </div>
        <div id="about-section">
          <About />
        </div>
        <div id="events-section">
          <Events />
        </div>
        <div id="our-tutors-section">
          <OurTutors />
        </div>
        <div id="contact-us-section">
          <ContactUs />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
