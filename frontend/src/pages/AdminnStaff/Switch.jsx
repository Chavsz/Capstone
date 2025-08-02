import { useState, useEffect } from "react";
import axios from "axios";

const Switch = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTutors, setTotalTutors] = useState(0);
  const [totalTutees, setTotalTutees] = useState(0);
  const itemsPerPage = 10;

  // Get all users
  const getAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setAllUsers(response.data);
      
      // Count tutors and tutees
      const tutors = response.data.filter(user => user.user_role === "tutor");
      const tutees = response.data.filter(user => user.user_role === "student");
      setTotalTutors(tutors.length);
      setTotalTutees(tutees.length);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Update user role
  const updateUserRole = async (id, role) => {
    try {
      await axios.put(`http://localhost:5000/users/${id}`, { role });
      getAllUsers(); // Refresh the data
    } catch (err) {
      console.error(err.message); 
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Filter users based on selected filter
  const getFilteredUsers = () => {
    switch (selectedFilter) {
      case "Tutor":
        return allUsers.filter(user => user.user_role === "tutor");
      case "Tutee":
        return allUsers.filter(user => user.user_role === "student");
      default:
        return allUsers;
    }
  };

  const filteredUsers = getFilteredUsers();
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-[24px] font-bold text-border-600 mb-10">Switch Roles</h1>

      {/* Summary Cards */}
      <div className="flex gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 w-[200px]">
          <div className="text-gray-600 text-sm">Total Tutors</div>
          <div className="text-2xl font-bold text-gray-800">{totalTutors}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 w-[200px]">
          <div className="text-gray-600 text-sm">Total Tutee</div>
          <div className="text-2xl font-bold text-gray-800">{totalTutees}</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {["All", "Tutor", "Tutee"].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              selectedFilter === filter
                ? "bg-blue-600 text-white border-b-2 border-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => {
              setSelectedFilter(filter);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Switch Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.user_email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.user_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.user_role === "tutor" ? "Tutor" : "Tutee"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => updateUserRole(user.user_id, user.user_role === "tutor" ? "student" : "tutor")}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
        </div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <button
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Switch;
