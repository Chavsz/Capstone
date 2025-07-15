import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Star display component
const StarDisplay = ({ value }) => {
  const rounded = Math.round(value * 10) / 10;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-xl ${star <= Math.round(rounded) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
      ))}
      <span className="ml-1 text-base font-semibold text-gray-700">{rounded}</span>
    </div>
  );
};

const Schedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState({}); // { appointment_id: rating }
  const [userId, setUserId] = useState("");

  const getAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/appointment/tutor", {
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

  // Get current tutor's user id
  const getUserId = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/dashboard", {
        headers: { token }
      });
      if (response.data.user_id) setUserId(response.data.user_id);
      else {
        // fallback: fetch from profile
        const profileRes = await axios.get("http://localhost:5000/dashboard/profile", {
          headers: { token }
        });
        if (profileRes.data && profileRes.data.user_id) setUserId(profileRes.data.user_id);
      }
    } catch (err) {
      // ignore
    }
  };

  // Fetch feedbacks for all appointments for this tutor
  const getFeedbacks = async (uid) => {
    try {
      if (!uid) return;
      const response = await axios.get(`http://localhost:5000/appointment/tutor/${uid}/appointment-feedback`);
      // Map feedbacks by appointment_id
      const feedbackMap = {};
      response.data.forEach(fb => {
        if (fb.appointment_id) feedbackMap[fb.appointment_id] = fb.rating;
      });
      setFeedbacks(feedbackMap);
    } catch (err) {
      setFeedbacks({});
    }
  };

  useEffect(() => {
    getAppointments();
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) getFeedbacks(userId);
  }, [userId]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/appointment/${appointmentId}/status`,
        { status },
        { headers: { token } }
      );
      getAppointments(); // Refresh the list
      setMessage(`Appointment ${status} successfully`);
    } catch (err) {
      console.error(err.message);
      setMessage("Error updating appointment status");
    }
  };

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
      case 'completed':
        return 'bg-blue-100 text-blue-800';
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
          <p>No appointments found. Students will appear here when they book sessions with you.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((appointment) => (
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
                <p><strong>Student:</strong> {appointment.student_name}</p>
                {/* Show rating for completed appointments if available */}
                {appointment.status === 'completed' && feedbacks[appointment.appointment_id] && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-gray-700 font-medium">Rating:</span>
                    <StarDisplay value={feedbacks[appointment.appointment_id]} />
                  </div>
                )}
                {appointment.status === 'completed' && !feedbacks[appointment.appointment_id] && (
                  <div className="mt-2 text-gray-400">No rating yet</div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                {appointment.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(appointment.appointment_id, 'confirmed')}
                      className="bg-[#132c91] text-white rounded-md px-4 py-2 text-sm hover:bg-[#0f1f6b]"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(appointment.appointment_id, 'declined')}
                      className="bg-[#e02402] text-white rounded-md px-4 py-2 text-sm hover:bg-[#b81d02]"
                    >
                      Decline
                    </button>
                  </>
                )}
                {appointment.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(appointment.appointment_id, 'started')}
                      className="bg-[#1e90ff] text-white rounded-md px-4 py-2 text-sm hover:bg-[#1565c0]"
                    >
                      Start Session
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(appointment.appointment_id, 'cancelled')}
                      className="bg-[#e02402] text-white rounded-md px-4 py-2 text-sm hover:bg-[#b81d02]"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {(appointment.status === 'started' || appointment.status === 'ongoing') && (
                  <button
                    onClick={() => handleStatusUpdate(appointment.appointment_id, 'completed')}
                    className="bg-[#16a34a] text-white rounded-md px-4 py-2 text-sm hover:bg-[#166534]"
                  >
                    Complete Appointment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;