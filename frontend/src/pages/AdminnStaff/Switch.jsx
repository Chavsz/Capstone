import { useState, useEffect } from "react";
import axios from "axios";

const Switch = () => {
  const [users, setUsers] = useState([]);
  const [selectedType, setSelectedType] = useState("tutor");

  //get users by role
  const getUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/${selectedType}`
      );
      console.log(response.data);
      setUsers(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  //update user role
  const updateUserRole = async (id, role) => {
    try {
      await axios.put(`http://localhost:5000/users/${id}`, { role });
      getUsers();
    } catch (err) {
      console.error(err.message); 
    }
  };

  useEffect(() => {
    getUsers();
  }, [selectedType]);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1>Switch</h1>

      <div className="my-6 flex justify-around items-center">
        {["tutor", "student"].map((type) => (
          <button
            key={type}
            className={`font-semibold border-2 border-[#132c91] rounded-md p-2 ${
              selectedType === type ? "bg-[#132c91] text-white" : ""
            }`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>

    <div>
        <h2 className="text-lg font-bold mb-2">{selectedType}</h2>

        {/* Not working */}
        <div className="mb-4 w-[300px]"> 
          <input
            type="text"
            placeholder="Search"
            className="border-2 border-gray-300 rounded-md p-2 w-full"
          />
        </div>

        <ul>
          {users.map((user) => (
            <li key={user.user_id} className="mb-2 border p-2.5 rounded-md">
              <div className='p-0.5'>Name: {user.user_name}</div>
              <div className='p-0.5'>Email: {user.user_email}</div>
              <div className="flex justify-between items-center p-0.5">Role: {user.user_role} <button className="bg-[#132c91] text-white px-2 py-1 rounded-md" onClick={() => updateUserRole(user.user_id, user.user_role === "tutor" ? "student" : "tutor")}>Switch Role</button></div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default Switch;
