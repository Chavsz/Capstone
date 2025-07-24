

import React, { useState, useEffect } from "react";
import axios from "axios";

const Announcments = () => {
  const [formData, setFormData] = useState({
    event_title: "",
    event_description: "",
    event_time: "",
    event_date: "",
    event_location: "",
    event_image: null,
  });

  const [announcement, setAnnouncement] = useState(null);
  const [announcementContent, setAnnouncementContent] = useState("");
  const [isEditingAnnouncement, setIsEditingAnnouncement] = useState(false);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get("http://localhost:5000/announcement");
        if (response.data) {
          setAnnouncement(response.data);
          setAnnouncementContent(response.data.announcement_content);
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
      }
    };
    fetchAnnouncement();
  }, []);

  // Announcement submit
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      if (announcement && isEditingAnnouncement) {
        const response = await axios.put(
          `http://localhost:5000/announcement/${announcement.id}`,
          {
            announcement_content: announcementContent,
          }
        );
        setAnnouncement(response.data.announcement);
        alert("Announcement updated successfully.");
      } else {
        const response = await axios.post(
          "http://localhost:5000/announcement",
          {
            announcement_content: announcementContent,
          }
        );
        setAnnouncement(response.data.announcement);
        alert("Announcement created successfully.");
      }
      setIsEditingAnnouncement(false);
    } catch (error) {
      console.error("Error submitting announcement:", error);
      alert("Failed to submit announcement.");
    }
  };

  // Announcement delete
  const handleAnnouncementDelete = async () => {
    if (!announcement) return;
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await axios.delete(
          `http://localhost:5000/announcement/${announcement.id}`
        );
        setAnnouncement(null);
        setAnnouncementContent("");
        setIsEditingAnnouncement(false);
        alert("Announcement deleted successfully.");
      } catch (error) {
        console.error("Error deleting announcement:", error);
        alert("Failed to delete announcement.");
      }
    }
  };

  return (
    <div className="min-h-screen flex-col bg-gray-100 font-sans p-6">
      {/* Announcement Section */}
      <aside className=" flex-col">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-4">
          Announcements
        </h1>

        {announcement ? (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Current Announcement
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {announcement.announcement_content}
            </p>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => setIsEditingAnnouncement(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Edit
              </button>
              <button
                onClick={handleAnnouncementDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-center">
            <p className="text-gray-600 italic">No announcement found.</p>
          </div>
        )}

        <form
          onSubmit={handleAnnouncementSubmit}
          className="bg-white p-4 rounded-lg shadow-md flex flex-col"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            {isEditingAnnouncement
              ? "Edit Announcement"
              : "Create New Announcement"}
          </h2>
          <input
            type="text"
            value={announcementContent}
            onChange={(e) => setAnnouncementContent(e.target.value)}
            placeholder="Enter your announcement here..."
            className="w-full p-2 border border-gray-300 rounded-lg mb-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            maxLength={100}
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mb-2"
          >
            {isEditingAnnouncement
              ? "Update Announcement"
              : "Publish Announcement"}
          </button>
          {isEditingAnnouncement && (
            <button
              type="button"
              onClick={() => setIsEditingAnnouncement(false)}
              className="w-full py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </aside>
    </div>
  );
};

export default Announcments;

