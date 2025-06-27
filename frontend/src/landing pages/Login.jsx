import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = ({setAuth}) => {

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [role, setRole] = useState(localStorage.getItem("role") || "");

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
        setRole(response.data.role);
      }
      setAuth(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Login</h1>
        <form onSubmit={onSubmitForm} className="flex flex-col gap-2">
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
          <button className="p-2 rounded-md bg-blue-500 text-white" type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </>
  );
};

export default Login;
