import React from "react";
import { motion } from "framer-motion";

function ContactUs() {
  return (
    <motion.div
      id="contactus"
      initial={{ opacity: 0, x: 200 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="mx-auto py-20  lg:px-32 w-full p-6 overflow-hidden"
    >
      <h1 className="text-2xl sm:text-4xl mb-7 font-bold text-center">
        Contact With Us
      </h1>

      <form action="" className="max-w-2xl mx-auto text-gray-600 pt-8">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 text-left">
            Your Name
            <input
              className="w-full border border-gray-300 rounded py-3 px-4 mt-2"
              type="text"
              name="name"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="w-full md:w-1/2 text-left md:pl-4">
            Your Email
            <input
              className="w-full border border-gray-300 rounded py-3 px-4 mt-2"
              type="text"
              name="email"
              placeholder="Your Email"
              required
            />
          </div>
        </div>
        <div className="my-6 text-left">
          Message
          <textarea
            className="w-full border border-gray-300 rounded py-3 px-4 mt-2 h-48 resize-none"
            name="message"
            placeholder="Message"
            required
          ></textarea>
        </div>
        <button className="bg-blue-600 text-white px-12 py-2 rounded-sm mb-10 ">
          Send Message
        </button>
      </form>
    </motion.div>
  );
}

export default ContactUs;
