import React from "react";
import LAV_image from "../assets/LAV_image.png";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    navigate("/");
    // Scroll to section after navigation
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div
      className="pt-10 px-4 md:px-20 lg:px-32 bg-[#132c91] w-full overflow-hidden"
      id="footer"
    >
      <div className="contaIner mx-auto flex flex-col md:flex-row justify-between items-start">
        <div className="w-full md:w-1/3 mb-8 md:mb-0 flex gap-3">
          <img src={LAV_image} alt="" />
          <p className="text-white text-2xl font-bold">
            Learning Assitance Volunteer
          </p>
        </div>
        <div className="w-full md:w-1/5 mb-8 md:mb-0">
          <h3 className="text-white text-lg font-bold mb-4">Organization</h3>
          <ul className="flex flex-col gap-2 ">
            <a
              className="text-gray-400 hover:text-white"
              href="#"
              onClick={(e) => handleSectionClick(e, "home-section")}
            >
              Home
            </a>
            <a
              className="text-gray-400 hover:text-white"
              href="#"
              onClick={(e) => handleSectionClick(e, "about-section")}
            >
              About
            </a>
            <a
              className="text-gray-400 hover:text-white"
              href="#"
              onClick={(e) => handleSectionClick(e, "tutors-section")}
            >
              Our Tutors
            </a>
            <a
              className="text-gray-400 hover:text-white"
              href="#"
              onClick={(e) => handleSectionClick(e, "contact-section")}
            >
              Contact Us
            </a>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-300 py-4 mt-10 text-center text-gray-100 flex items-start">  Copyright 2025 ©. All Right Reserved.  </div>
    </div>
  );
};

export default Footer;
