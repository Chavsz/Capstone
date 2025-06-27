import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <>
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Register</h1>
      <form className="flex flex-col gap-2">
        <input className="p-2 rounded-md border-2 border-gray-300" type="text" placeholder="Username" />
        <input className="p-2 rounded-md border-2 border-gray-300" type="password" placeholder="Password" />
        <button className="p-2 rounded-md bg-blue-500 text-white" type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
    </>
  )
}

export default Register