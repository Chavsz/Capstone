import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
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
    <>
      <div className="bg-gray-500 px-5 py-2 sticky top-0 z-50 flex justify-between items-stretch">
        <a
          className="text-white text-2xl font-bold"
          href="#"
          onClick={(e) => handleSectionClick(e, "home-section")}
        >
          Home
        </a>

        <ul className="flex gap-5.5">
          <li className="hover:bg-[#bab8b8] p-1.5 text-white">
            <a href="#" onClick={(e) => handleSectionClick(e, "about-section")}>
              About
            </a>
          </li>
          <li className="hover:bg-[#bab8b8] p-1.5 text-white">
            <a
              href="#"
              onClick={(e) => handleSectionClick(e, "events-section")}
            >
              Events
            </a>
          </li>
          <li className="hover:bg-[#bab8b8] p-1.5 text-white">
            <a
              href="#"
              onClick={(e) => handleSectionClick(e, "our-tutors-section")}
            >
              Our Tutors
            </a>
          </li>
          <li className="hover:bg-[#bab8b8] p-1.5 text-white">
            <a
              href="#"
              onClick={(e) => handleSectionClick(e, "contact-us-section")}
            >
              Contact Us
            </a>
          </li>
        </ul>

        <Link className="hover:bg-[#bab8b8] p-1.5 text-white" to="/login">
          Login
        </Link>
      </div>
    </>
  );
};

export default Navbar;
