import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LAVLogo from "../assets/LAV_image.png";

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const { email, password } = inputs;

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const body = { email, password };
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        body
      );
      localStorage.setItem("token", response.data.token);
      if (response.data.role) {
        localStorage.setItem("role", response.data.role);
      }
      setAuth(true);
    } catch (err) {
      console.error(err.message);
      setMessage("Incorrect email or password");
    }
  };

  return (
    <div className="flex h-screen p-3">
      {/* Left Panel - Blue Background with Logo (Less Wide) */}
      <div className="w-1/3 bg-blue-600 flex flex-col items-center justify-center relative rounded-md">
        <Link to="/" className="absolute top-8 left-8 flex items-center ">
          <img src={LAVLogo} alt="LAV Logo" className="w-8 h-8" />
          <span className="ml-2 text-white font-semibold text-lg">LAV</span>
        </Link>

        {/* Large Centered Logo */}
        <div className="flex flex-col items-center">
          <img src={LAVLogo} alt="LAV Logo" className="w-50 h-50 mb-4" />
          <h1
            className="text-6xl font-bold text-white tracking-wider"
          >
          </h1>
        </div>
      </div>

      {/* Right Panel - White Background with Form */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center px-16">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">
            Welcome!
          </h2>

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300">
              <p className="text-red-600 text-sm">{message}</p>
            </div>
          )}

          <form onSubmit={onSubmitForm} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => onChange(e)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => onChange(e)}
                required
              />
            </div>

            {/* Log In Button */}
            <button
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
            >
              Log in
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-gray-600">
            Don't have account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
