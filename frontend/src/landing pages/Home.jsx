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
      setLandingData({
        home_image: "",
        home_title: "Welcome to LAV",
        home_description: "Your learning journey starts here",
        home_more: "Discover more about our services",
      });
    }
  };

  useEffect(() => {
    getLandingData();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              >
                <span className="bg-blue-600 bg-clip-text text-transparent">
                  {landingData.home_title || "Welcome to LAV"}
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl lg:text-2xl text-gray-600 leading-relaxed"
              >
                {landingData.home_description || "Your learning journey starts here"}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg text-gray-500"
              >
                {landingData.home_more || "Discover more about our services"}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="space-y-6"
            >
              <p className="text-lg font-medium text-gray-700">
                Want to appoint a tutorial session?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full text-md transition-all duration-300 transform hover:scale-90 shadow-lg hover:shadow-xl"
                  to="/register"
                >
                  Get Started Today
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src={`http://localhost:5000${
                    landingData.home_image || "/uploads/landing/placeholder.png"
                  }`}
                  alt="Learning"
                  className="w-full h-auto object-cover rounded-3xl"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80";
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Home;
