import React, { useState, useEffect } from "react";
import axios from "axios";

// Simple Star Rating component
const StarRating = ({ value, onChange, disabled }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl ${
            star <= value ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => !disabled && onChange(star)}
          disabled={disabled}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const Schedules = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState({}); // { appointment_id: true }
  const [ratingState, setRatingState] = useState({}); // { appointment_id: rating }
  const [submitting, setSubmitting] = useState({}); // { appointment_id: true/false }

  const getAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/appointment/tutee",
        {
          headers: { token },
        }
      );
      setAppointments(response.data);
    } catch (err) {
      console.error(err.message);
      setMessage("Error loading appointments");
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedbacks for all appointments
  const getFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/appointment/feedback/tutee",
        {
          headers: { token },
        }
      );
      // Build a map: { appointment_id: true }
      const feedbackMap = {};
      response.data.forEach((fb) => {
        if (fb.appointment_id) feedbackMap[fb.appointment_id] = true;
      });
      setFeedbacks(feedbackMap);
    } catch (err) {
      setFeedbacks({});
    }
  };

  useEffect(() => {
    getAppointments();
    getFeedbacks();
  }, []);

  const handleDelete = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/appointment/${appointmentId}`, {
        headers: { token },
      });
      getAppointments(); // Refresh the list
      setMessage("Appointment deleted successfully");
    } catch (err) {
      console.error(err.message);
      setMessage("Error deleting appointment");
    }
  };

  const handleRatingChange = (appointmentId, rating) => {
    setRatingState((prev) => ({ ...prev, [appointmentId]: rating }));
  };

  const handleSubmitRating = async (appointmentId, tutorId) => {
    const rating = ratingState[appointmentId];
    if (!rating) return;
    setSubmitting((prev) => ({ ...prev, [appointmentId]: true }));
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/appointment/${appointmentId}/feedback`,
        { rating },
        { headers: { token } }
      );
      await getFeedbacks(); // Refresh feedbacks from backend
      setMessage("Feedback submitted successfully!");
    } catch (err) {
      setMessage("Error submitting feedback");
    } finally {
      setSubmitting((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <div
          className={`mt-4 p-3 rounded-md ${
            message.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
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
          {appointments
            .filter((appointment) => appointment.status !== "declined")
            .map((appointment) => (
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
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Topic:</strong> {appointment.topic}
                  </p>
                  <p>
                    <strong>Mode:</strong> {appointment.mode_of_session}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(appointment.date)}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatTime(appointment.start_time)}{" "}
                    - {formatTime(appointment.end_time)}
                  </p>
                  <p>
                    <strong>Tutor:</strong> {appointment.tutor_name}
                  </p>
                  {appointment.tutor_name && (
                    <>
                      <p>
                        <strong>Program:</strong>{" "}
                        {appointment.program || "Not specified"}
                      </p>
                      <p>
                        <strong>College:</strong>{" "}
                        {appointment.college || "Not specified"}
                      </p>
                      <p>
                        <strong>Specialization:</strong>{" "}
                        {appointment.specialization || "Not specified"}
                      </p>
                    </>
                  )}
                </div>
                {/* Feedback UI for completed appointments */}
                {appointment.status === "completed" &&
                  !feedbacks[appointment.appointment_id] && (
                    <div className="mt-4">
                      <div className="mb-2 font-medium">Rate your tutor:</div>
                      <StarRating
                        value={ratingState[appointment.appointment_id] || 0}
                        onChange={(star) =>
                          handleRatingChange(appointment.appointment_id, star)
                        }
                        disabled={!!submitting[appointment.appointment_id]}
                      />
                      <button
                        className="mt-2 bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
                        disabled={
                          !ratingState[appointment.appointment_id] ||
                          submitting[appointment.appointment_id]
                        }
                        onClick={() =>
                          handleSubmitRating(
                            appointment.appointment_id,
                            appointment.tutor_id
                          )
                        }
                      >
                        {submitting[appointment.appointment_id]
                          ? "Submitting..."
                          : "Submit Rating"}
                      </button>
                    </div>
                  )}
                {/* Show thank you if already rated, and hide star rating and button */}
                {appointment.status === "completed" &&
                  feedbacks[appointment.appointment_id] && (
                    <div className="mt-4 text-green-700 font-medium">
                      Thank you for your feedback!
                    </div>
                  )}
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
