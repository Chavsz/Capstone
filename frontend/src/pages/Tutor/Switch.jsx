import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationModal from "../../components/ConfirmationModal";

const Switch = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSwitchClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSwitch = async () => {
    setIsLoading(true);
    try {
      // Call the API to change role in database
      const response = await axios.put(
        "http://localhost:5000/dashboard/switch-role",
        { newRole: "student" },
        {
          headers: { token: localStorage.getItem("token") }
        }
      );

      if (response.data.success) {
        // Update localStorage with the new role from database
        localStorage.setItem("role", "student");
        setIsModalOpen(false);
        
        // Dispatch custom event to notify App component of role change
        window.dispatchEvent(new CustomEvent('roleChanged', { detail: { newRole: 'student' } }));
        
        // Navigate to dashboard to trigger role-based routing
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error switching role:", error);
      alert("Failed to switch role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSwitch = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="py-3 px-6 bg-white">
      <h1 className="text-blue-600 font-bold text-2xl mb-6">Switch</h1>
      <div>
        <h1 className="text-sm font-medium text-gray-600 mb-2">Switch to Student</h1>
        <button 
          onClick={handleSwitchClick}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 hover:translate-y-[-2px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Switching..." : "Switch"}
        </button>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelSwitch}
        onConfirm={handleConfirmSwitch}
        title="Switch to Student Role"
        message="Are you sure you want to switch to the Student interface? This will permanently change your role in the database and affect your available features."
        confirmText="Switch to Student"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Switch;
