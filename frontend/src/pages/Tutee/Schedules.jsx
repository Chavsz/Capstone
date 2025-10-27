import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// Modal component for appointment details
const AppointmentModal = ({
  appointment,
  isOpen,
  onClose,
  onDelete,
}) => {
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

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-[#132c91]">
            Appointment Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Subject:</span>
            <span className="text-gray-900">{appointment.subject}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Topic:</span>
            <span className="text-gray-900">{appointment.topic}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Tutor:</span>
            <span className="text-gray-900">{appointment.tutor_name}</span>
          </div>
          {appointment.tutor_name && (
            <>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Program:</span>
                <span className="text-gray-900">
                  {appointment.program || "Not specified"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">College:</span>
                <span className="text-gray-900">
                  {appointment.college || "Not specified"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Specialization:</span>
                <span className="text-gray-900">
                  {appointment.specialization || "Not specified"}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Date:</span>
            <span className="text-gray-900">
              {formatDate(appointment.date)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Time:</span>
            <span className="text-gray-900">
              {formatTime(appointment.start_time)} -{" "}
              {formatTime(appointment.end_time)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Mode:</span>
            <span className="text-gray-900">{appointment.mode_of_session}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                appointment.status
              )}`}
            >
              {appointment.status}
            </span>
          </div>
          {appointment.status === "confirmed" && appointment.online_link && (
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Online Link:</span>
              <a
                href={appointment.online_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
              >
                Join Meeting
              </a>
            </div>
          )}
          {appointment.status === "confirmed" && appointment.file_link && (
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Materials:</span>
              <a
                href={appointment.file_link}
                rel="noopener noreferrer"
                target="_blank"
                className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
              >
                {appointment.file_link}
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              onDelete(appointment.appointment_id);
              onClose();
            }}
            className="bg-gray-500 text-white rounded-md px-4 py-2 text-sm hover:bg-gray-600 flex-1"
          >
            Delete Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

const Schedules = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("upcoming");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      toast.error("Error loading appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
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
      toast.success("Appointment deleted successfully");
    } catch (err) {
      console.error(err.message);
      toast.error("Error deleting appointment");
    }
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const getDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Always return a consistent formatted date string for display (no Today/Tomorrow)
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDateSubtitle = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } else {
      return null;
    }
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <h1 className="text-[#132c91] font-bold text-2xl">Schedules</h1>
        <div className="mt-6 text-center">Loading appointments...</div>
      </div>
    );
  }

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "confirmed" ||
      appointment.status === "pending" ||
      appointment.status === "started"
  );

  const historyAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "completed" ||
      appointment.status === "declined" ||
      appointment.status === "cancelled"
  );

  // Group appointments by date
  const groupAppointmentsByDate = (appointmentsList) => {
    const grouped = {};
    appointmentsList.forEach((appointment) => {
      const dateKey = getDateLabel(appointment.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(appointment);
    });

    // Sort the grouped appointments by date priority
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      // Priority order: Today, Tomorrow, then chronological
      if (a === "Today") return -1;
      if (b === "Today") return 1;
      if (a === "Tomorrow") return -1;
      if (b === "Tomorrow") return 1;

      // For other dates, sort chronologically
      const dateA = new Date(
        appointmentsList.find((apt) => getDateLabel(apt.date) === a)?.date
      );
      const dateB = new Date(
        appointmentsList.find((apt) => getDateLabel(apt.date) === b)?.date
      );
      return dateA - dateB;
    });

    // Create new sorted object
    const sortedGrouped = {};
    sortedKeys.forEach((key) => {
      sortedGrouped[key] = grouped[key];
    });

    return sortedGrouped;
  };

  // Group appointments for history: use pure date keys and uniform display labels
  const groupHistoryAppointmentsByDate = (appointmentsList) => {
    const grouped = {};
    appointmentsList.forEach((appointment) => {
      const d = new Date(appointment.date);
      const isoKey = new Date(
        Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
      )
        .toISOString()
        .slice(0, 10); // YYYY-MM-DD
      if (!grouped[isoKey]) grouped[isoKey] = [];
      grouped[isoKey].push(appointment);
    });

    const sortedKeys = Object.keys(grouped).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    const sortedGrouped = {};
    sortedKeys.forEach((key) => {
      sortedGrouped[key] = grouped[key];
    });
    return sortedGrouped;
  };

  const groupedUpcomingAppointments = groupAppointmentsByDate(
    upcomingAppointments
  );
  const groupedHistoryAppointments =
    groupHistoryAppointmentsByDate(historyAppointments);

  return (
    <div className="py-3 px-6">
      <h1 className="text-blue-600 font-bold text-2xl mb-6">Schedules</h1>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          className={`py-2 font-medium transition-all duration-200 text-gray-600 border-b-2 ${
            selectedFilter === "upcoming"
              ? "border-b-blue-600 text-blue-600"
              : "border-b-transparent"
          }`}
          onClick={() => handleFilterChange("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`py-2 font-medium transition-all duration-200 text-gray-600 border-b-2 ${
            selectedFilter === "history"
              ? "border-b-blue-600 text-blue-600"
              : "border-b-transparent"
          }`}
          onClick={() => handleFilterChange("history")}
        >
          History
        </button>
      </div>

      {/* Upcoming Appointments View */}
      {selectedFilter === "upcoming" && (
        <div className="space-y-6">
          {Object.keys(groupedUpcomingAppointments).length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>
                No upcoming appointments found. Book your first appointment!
              </p>
            </div>
          ) : (
            Object.entries(groupedUpcomingAppointments).map(
              ([date, appointments]) => (
                <div key={date}>
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {date}
                    </h3>
                    {getDateSubtitle(appointments[0]?.date) && (
                      <p className="text-sm text-gray-500">
                        {getDateSubtitle(appointments[0]?.date)}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.appointment_id}
                        className="bg-blue-50 border border-blue-300 rounded-lg p-4 cursor-pointer hover:shadow-md hover:shadow-blue-100 transition-shadow"
                        onClick={() => openModal(appointment)}
                      >
                        <div className="pl-3 border-l-3 border-blue-300">
                          <div className="font-medium text-gray-900 mb-1">
                            {appointment.tutor_name}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {formatTime(appointment.start_time)} -{" "}
                            {formatTime(appointment.end_time)}
                          </div>
                          <div className="text-sm text-gray-500 mb-1">
                            {appointment.mode_of_session}
                          </div>
                          {/* {appointment.status === "confirmed" && appointment.online_link && (
                            <div className="text-xs text-green-600 font-medium">
                              Online link available
                            </div>
                          )} */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>
      )}

      {/* History View */}
      {selectedFilter === "history" && (
        <div className="space-y-6">
          {Object.keys(groupedHistoryAppointments).length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No appointment history found.</p>
            </div>
          ) : (
            Object.entries(groupedHistoryAppointments).map(
              ([isoDate, appointments]) => (
                <div key={isoDate}>
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {getFormattedDate(appointments[0]?.date)}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.appointment_id}
                        className="bg-blue-50 border border-blue-300 rounded-lg p-4 cursor-pointer hover:shadow-md hover:shadow-blue-100 transition-shadow"
                        onClick={() => openModal(appointment)}
                      >
                        <div className="pl-3 border-l-3 border-blue-300">
                          <div className="font-medium text-gray-900 mb-1">
                            {appointment.tutor_name}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {formatTime(appointment.start_time)} -{" "}
                            {formatTime(appointment.end_time)}
                          </div>
                          <div className="text-sm text-gray-500 mb-1">
                            {appointment.mode_of_session}
                          </div>
                          {/* {appointment.status === "confirmed" && appointment.online_link && (
                            <div className="text-xs text-green-600 font-medium">
                              Online link available
                            </div>
                          )} */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>
      )}

      {/* Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={closeModal}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Schedules;
