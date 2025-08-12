import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      // Get navbar height for offset
      const navbar = document.querySelector('.sticky');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      
      const sectionTop = section.offsetTop - navbarHeight;
      window.scrollTo({
        top: sectionTop,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <div className="px-10 py-1.5 sticky top-0 z-50 flex justify-between items-stretch bg-white">
        <a
          className="text-black text-2xl font-bold"
          href="#"
          onClick={(e) => handleSectionClick(e, "home-section")}
        >
          Home
        </a>

        <ul className="flex gap-5.5">
          <li className="hover:text-blue-500 p-1.5 text-black font-semibold">
            <a href="#" onClick={(e) => handleSectionClick(e, "about-section")}>
              About
            </a>
          </li>
          <li className="hover:text-blue-500 p-1.5 text-black font-semibold">
            <a
              href="#"
              onClick={(e) => handleSectionClick(e, "events-section")}
            >
              Events
            </a>
          </li>
          <li className="hover:text-blue-500 p-1.5 text-black font-semibold">
            <a
              href="#"
              onClick={(e) => handleSectionClick(e, "our-tutors-section")}
            >
              Our Tutors
            </a>
          </li>
          <li className="hover:text-blue-500 p-1.5 text-black font-semibold">
            <a
              href="#"
              onClick={(e) => handleSectionClick(e, "contact-us-section")}
            >
              Contact Us
            </a>
          </li>
        </ul>

        <div className="flex gap-2">
          <Link className="hover:text-blue-500 p-1.5 text-black" to="/login">
            Login
          </Link>

          <Link className="hover:text-blue-500 hover:bg-white hover:border-2 p-1.5 border-2 border-blue-500 text-white bg-blue-500 rounded-[20px] px-4" to="/register" style={{ transition: "all 0.3s ease" }}>
            Register
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
