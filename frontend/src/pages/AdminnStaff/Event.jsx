import { useState, useEffect } from "react";
import axios from "axios";

const Event = () => {
  const [formData, setFormData] = useState({
    event_title: "",
    event_description: "",
    event_time: "",
    event_date: "",
    event_location: "",
    event_image: null,
  });

  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/event");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, event_image: e.target.files[0] });
  };

  // Event submit
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        form.append(key, value);
      }
    });

    try {
      if (editingEvent) {
        const response = await axios.put(
          `http://localhost:5000/event/${editingEvent.event_id}`,
          form,
          {
            headers: { 
              "Content-Type": "multipart/form-data",
              token: localStorage.getItem("token")
            },
          }
        );
        setEvents(
          events.map((event) =>
            event.event_id === editingEvent.event_id ? response.data.event : event
          )
        );
        setEditingEvent(null);
        alert("Event updated successfully.");
      } else {
        const response = await axios.post("http://localhost:5000/event", form, {
          headers: { 
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token")
          },
        });
        setEvents([...events, response.data.event]);
        alert("Event added successfully.");
      }
      setFormData({
        event_title: "",
        event_description: "",
        event_time: "",
        event_date: "",
        event_location: "",
        event_image: null,
      });
      document.getElementById("eventImageInput").value = "";
    } catch (error) {
      console.error(
        "Error submitting event:",
        error.response ? error.response.data : error.message
      );
      alert(
        `Failed to submit event: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  // Event edit
  const handleEventEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      event_title: event.event_title,
      event_description: event.event_description,
      event_time: event.event_time.substring(0, 5),
      event_date: new Date(event.event_date).toISOString().split("T")[0],
      event_location: event.event_location,
      event_image: null,
    });
  };

  // Event delete
  const handleEventDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:5000/event/${eventId}`, {
          headers: { token: localStorage.getItem("token") }
        });
        setEvents(events.filter((event) => event.event_id !== eventId));
        alert("Event deleted successfully.");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* Event Section */}
      <main className="w-full p-6 flex flex-col">
        <h1 className="text-[24px] font-bold text-blue-600 mb-4">Events</h1>

        {/* Event Form */}
        <div className="px-15">
          <div className="bg-white p-6 rounded-lg border-1 border-[#EBEDEF] mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5">
              {editingEvent ? "Edit Event" : "Add New Event"}
            </h2>
            <form
              onSubmit={handleEventSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <div>
                <label
                  htmlFor="event_title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Event Title
                </label>
                <input
                  type="text"
                  name="event_title"
                  id="event_title"
                  placeholder="e.g., Crash Tutorial"
                  value={formData.event_title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="event_description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Event Description
                </label>
                <textarea
                  name="event_description"
                  id="event_description"
                  placeholder="A brief description of the event..."
                  value={formData.event_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="event_time"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Event Time
                </label>
                <input
                  type="time"
                  name="event_time"
                  id="event_time"
                  value={formData.event_time}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="event_date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Event Date
                </label>
                <input
                  type="date"
                  name="event_date"
                  id="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="event_location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Event Location
                </label>
                <input
                  type="text"
                  name="event_location"
                  id="event_location"
                  placeholder="e.g., MSU-IIT Lawn"
                  value={formData.event_location}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="eventImageInput"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Event Image
                </label>
                <input
                  type="file"
                  name="event_image"
                  id="eventImageInput"
                  onChange={handleFileChange}
                  className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  accept="image/*"
                />
                {editingEvent &&
                  editingEvent.event_image &&
                  !formData.event_image && (
                    <p className="text-sm text-gray-500 mt-1 italic">
                      Current image will be used unless a new one is uploaded.
                    </p>
                  )}
              </div>
              <div className="md:col-span-2 flex space-x-4 mt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {editingEvent ? "Update Event" : "Add Event"}
                </button>
                {editingEvent && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEvent(null);
                      setFormData({
                        event_title: "",
                        event_description: "",
                        event_time: "",
                        event_date: "",
                        event_location: "",
                        event_image: null,
                      });
                      document.getElementById("eventImageInput").value = "";
                    }}
                    className="flex-1 py-3 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Events Gallery */}
        <section id="events-list" className="flex-grow overflow-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <article
                  key={event.event_id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md flex flex-col hover:shadow-lg transition-shadow duration-200"
                >
                  {event.event_image ? (
                    <img
                      src={`http://localhost:5000${event.event_image}`}
                      alt={event.event_title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {event.event_title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                      {event.event_description}
                    </p>
                    <div className="text-gray-600 text-sm mb-1">
                      <strong>Time:</strong> {event.event_time}
                    </div>
                    <div className="text-gray-600 text-sm mb-1">
                      <strong>Date:</strong>{" "}
                      {new Date(event.event_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-gray-600 text-sm mb-4">
                      <strong>Location:</strong> {event.event_location}
                    </div>
                    <div className="mt-auto flex space-x-3">
                      <button
                        onClick={() => handleEventEdit(event)}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleEventDelete(event.event_id)}
                        className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600 py-10 italic">
                No events available yet.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Event;
