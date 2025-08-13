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
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              {landingData.about_title || "About LAV"}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {landingData.about_description || "We are dedicated to providing quality education and personalized learning experiences for students of all levels."}
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src={`http://localhost:5000${
                    landingData.about_image || "/uploads/landing/placeholder.png"
                  }`}
                  alt="About LAV"
                  className="w-full h-auto object-cover rounded-3xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">
                Empowering Students Through Quality Education
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                At LAV, we believe that every student deserves access to quality education. 
                Our platform connects students with expert tutors who are passionate about 
                teaching and committed to helping learners achieve their academic goals.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you're struggling with a specific subject or want to excel in your studies, 
                our personalized approach ensures that you get the support you need to succeed.
              </p>
            </div>

            <motion.a
              href={landingData.about_link}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Visit our FB Page
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

export default About;
