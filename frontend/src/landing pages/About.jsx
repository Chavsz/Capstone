import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function About() {
  const [landingData, setLandingData] = useState({
    about_image: "",
    about_title: "",
    about_description: "",
    about_link: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/landing")
      .then((response) => {
        setLandingData(response.data);
      })
      .catch((error) => console.error("Error fetching landing data:", error));
  }, []);

  return (
    <motion.div
      id="Home"
      initial={{ opacity: 0, x: 200 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-white"
    >
      <div className="min-h-screen flex flex-col items-center justify-center container mx-auto p-14 md:px-20 lg:px-32 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start md:gap-20">
          <img
            // Ensure correct path to the image
            src={`http://localhost:5000${
              landingData.about_image || "/uploads/landing/placeholder.png"
            }`}
            alt="Home"
            className="w-full sm:w-1/2 max-w-lg rounded-md"
          />

          <div className="flex flex-col items-center md:items-start mt-10 text-gray-600 gap-6">
            <h1 className="text-4xl font-bold text-black">
              {landingData.about_title}
            </h1>

            <p className="text-lg text-black">
              {landingData.about_description}
            </p>

            <a
              href={landingData.about_link} //
              style={{
                display: "inline-block",
                backgroundColor: "#4257a9", //
                color: "white",
                textAlign: "center",
                padding: "12px 10px",
                fontSize: "16px",
                fontWeight: "bold",
                textDecoration: "none",
                borderRadius: "100px",
                width: "200px",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#4e69a2")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#3b5998")}
            >
              Visit our FB Page
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default About;
