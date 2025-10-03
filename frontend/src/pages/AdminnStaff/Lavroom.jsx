import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Lavroom = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/appointment/admin",
        {
          headers: { token },
        }
      );
      setAppointments(response.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
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
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/appointment/admin/${appointmentId}`, {
        headers: { token }
      });
      getAppointments(); // Refresh the list
      toast.success("Appointment deleted successfully");
    } catch (err) {
      console.error(err.message);
      toast.error("Error deleting appointment");
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
      <h1 className="text-[24px] font-bold text-blue-600">Lavroom</h1>

      <div className="bg-gray-100 p-6 rounded-lg mt-6">
        <div className="grid grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment.appointment_id}
              className="bg-[#fafafa] p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-[#132c91]">
                  {appointment.subject}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-600">
                    Tutor: {appointment.tutor_name}
                  </p>
                  <p className="text-gray-600">
                    Student: {appointment.student_name}
                  </p>
                  <p className="text-gray-600">Specialization: {appointment.topic}</p>
                  <p className="text-gray-600">
                    Mode: {appointment.mode_of_session}
                  </p>
                  <p className="text-gray-600">Date: {formatDate(appointment.date)}</p>
                  <p className="text-gray-600">
                    Start Time: {formatTime(appointment.start_time)} -{" "}
                    End Time: {formatTime(appointment.end_time)}
                  </p>

                  <button 
                  onClick={() => handleDelete(appointment.appointment_id)}
                  className="bg-red-500 text-white rounded-md px-4 py-2 text-sm hover:bg-red-400 mt-4"
                >
                  Delete
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lavroom;
