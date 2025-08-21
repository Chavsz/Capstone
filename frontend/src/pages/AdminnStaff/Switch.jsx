import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AiOutlineUserSwitch } from "react-icons/ai";

const Switch = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTutors, setTotalTutors] = useState(0);
  const [totalTutees, setTotalTutees] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Get all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/dashboard/users",
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      const tutors = response.data.filter((user) => user.role === "tutor");
      const tutees = response.data.filter((user) => user.role === "student");
      setAllUsers(response.data);
      setTotalTutors(tutors.length);
      setTotalTutees(tutees.length);
    } catch (err) {
      console.error("Error fetching users:", err.message);
      alert("Failed to fetch users. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const updateUserRole = async (id, role) => {
    try {
      await axios.put(
        `http://localhost:5000/users/${id}`,
        { role },
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      await fetchUsers(); // Refresh the data
      toast.success("User role updated successfully");
    } catch (err) {
      console.error("Error updating user role:", err.message);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on selected filter
  const filteredUsers = () => {
    if (selectedFilter === "Tutor") {
      return allUsers.filter((user) => user.role === "tutor");
    } else if (selectedFilter === "Student") {
      return allUsers.filter((user) => user.role === "student");
    }
    return allUsers;
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers().length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers().slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-[24px] font-bold text-blue-600 mb-10">
        Switch Roles
      </h1>

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
        {["All", "Tutor", "Student"].map((filter) => (
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
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading users...</div>
          </div>
        ) : (
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
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.role === "tutor" ? "Tutor" : "Student"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() =>
                        updateUserRole(
                          user.user_id,
                          user.role === "tutor" ? "student" : "tutor"
                        )
                      }
                      className="text-blue-600 hover:text-blue-900 pl-4"
                    >
                      <AiOutlineUserSwitch />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers().length)}{" "}
          of {filteredUsers().length} entries
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
