import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Schedules = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const getAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/appointment/tutee", {
        headers: { token }
      });
      setAppointments(response.data);
    } catch (err) {
      console.error(err.message);
      setMessage("Error loading appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/appointment/${appointmentId}`, {
        headers: { token }
      });
      getAppointments(); // Refresh the list
      setMessage("Appointment deleted successfully");
    } catch (err) {
      console.error(err.message);
      setMessage("Error deleting appointment");
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <h1 className="text-[#132c91] font-bold text-2xl">Schedules</h1>
        <div className="mt-6 text-center">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-[#132c91] font-bold text-2xl">Schedules</h1>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="mt-6 text-center text-gray-500">
          <p>No appointments found. Book your first appointment!</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* filter out declined appointments */}
          {appointments.filter(appointment => appointment.status !== 'declined').map((appointment) => (
            <div key={appointment.appointment_id} className="bg-[#fafafa] p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-[#132c91]">
                  {appointment.subject}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Topic:</strong> {appointment.topic}</p>
                <p><strong>Mode:</strong> {appointment.mode_of_session}</p>
                <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
                <p><strong>Time:</strong> {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</p>
                <p><strong>Tutor:</strong> {appointment.tutor_name}</p>
                {appointment.tutor_name && (
                  <>
                    <p><strong>Program:</strong> {appointment.program || "Not specified"}</p>
                    <p><strong>College:</strong> {appointment.college || "Not specified"}</p>
                    <p><strong>Specialization:</strong> {appointment.specialization || "Not specified"}</p>
                  </>
                )}
              </div>

              <div className="mt-4">
                <button 
                  onClick={() => handleDelete(appointment.appointment_id)}
                  className="bg-gray-500 text-white rounded-md px-4 py-2 text-sm hover:bg-gray-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedules;