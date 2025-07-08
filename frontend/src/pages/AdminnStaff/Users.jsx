import { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  //get all users
  // const getUsers = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:5000/users/${selectedType}`);
  //     console.log(response.data);
  //     setUsers(response.data);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  // useEffect(() => {
  //   getUsers();
  // }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1>Users</h1>

      {/* <div className="my-6 flex justify-around items-center">
        {["admin", "student", "tutor"].map((type) => (
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
      </div> */}

      {/* <div>
        <h2 className="text-lg font-bold mb-2">{selectedType}</h2>
        <ul>
          {users.map((user) => (
            <li key={user.user_id} className="mb-2 border-b pb-2">
              <div>Name: {user.user_name}</div>
              <div>Email: {user.user_email}</div>
              <div>Role: {user.user_role}</div>
            </li>
          ))}
        </ul>
      </div> */}


    </div>
  );
};

export default Users;
