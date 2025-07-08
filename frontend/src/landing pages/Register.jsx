import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // default role
  });

  const { name, email, password, role } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { name, email, password, role };
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        body
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      setAuth(true);
    } catch (err) {
      console.err(err.message);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Register</h1>
        <form onSubmit={onSubmitForm} className="flex flex-col gap-2">
          <input
            className="p-2 rounded-md border-2 border-gray-300"
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => onChange(e)}
          />
          <input
            className="p-2 rounded-md border-2 border-gray-300"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => onChange(e)}
          />
          <input
            className="p-2 rounded-md border-2 border-gray-300"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => onChange(e)}
          />
          <button
            className="p-2 rounded-md bg-blue-500 text-white"
            type="submit"
          >
            Register
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </>
  );
};

export default Register;
