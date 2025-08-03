import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const [landingData, setLandingData] = useState({
    home_image: "",
    home_title: "",
    home_description: "",
    home_more: "",
  });

  const getLandingData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/landing");
      setLandingData(response.data);
    } catch (error) {
      console.error("Error fetching landing data:", error);
    }
  };

  useEffect(() => {
    getLandingData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -200 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="min-h-screen flex items-center overflow-hidden bg-white"
    >
      <div className="container mx-auto px-6 md:px-20 lg:px-32">
        <div className="flex items-center gap-15">
          <div className="w-2/5">
            <img
              // Ensure correct path to the image
              src={`http://localhost:5000${
                landingData.home_image || "/uploads/landing/placeholder.png"
              }`}
              alt="Home"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          <div className="space-y-4 flex flex-col">
            <p className="font-bold text-4xl">{landingData.home_title}</p>
            <p className="">{landingData.home_description}</p>
            <p className="font-semibold text-lg">{landingData.home_more}</p>
            <p className=" ">Want to appoint a tutorial session?</p>

            {/* Link to register page */}
            <Link
              className="inline-block w-[200px] text-white px-4 py-2 cursor-pointer rounded-full bg-blue-600 text-center font-bold"
              to="http://localhost:5173/register"
            >
              Get Started!
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;
