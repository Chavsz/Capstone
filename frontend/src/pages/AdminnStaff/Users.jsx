import React from "react";

const Users = () => {
  return (
    <div className="min-h-screen bg-white p-6">
      <h1>Users</h1>

      <div className="my-6 flex justify-around items-center">
        <div>
          <button className="font-semibold border-2 border-[#132c91] rounded-md p-2">
            Staffs
          </button>
        </div>
        <div>
          <button className="font-semibold border-2 border-[#132c91] rounded-md p-2">
            Tutors
          </button>
        </div>
        <div>
          <button className="font-semibold border-2 border-[#132c91] rounded-md p-2">
            Tutees
          </button>
        </div>
      </div>


    
    </div>
  );
};

export default Users;
