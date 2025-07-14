import { useState, useEffect } from "react";
import axios from "axios";

const Appointment = () => {
  const [tutors, setTutors] = useState([]);
  const [tutorDetails, setTutorDetails] = useState({});
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    mode_of_session: "Face-to-Face",
    date: "",
    start_time: "",
    end_time: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getTutors = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/tutor`);
      setTutors(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getTutorDetails = async (tutorId) => {
    try {
      const response = await axios.get(`http://localhost:5000/profile/${tutorId}`);
      if (response.data && response.data.length > 0) {
        setTutorDetails(prev => ({
          ...prev,
          [tutorId]: response.data[0]
        }));
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTutorSelect = (tutor) => {
    setSelectedTutor(tutor);
    if (!tutorDetails[tutor.user_id]) {
      getTutorDetails(tutor.user_id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTutor) {
      setMessage("Please select a tutor first");
      return;
    }

    if (!formData.subject || !formData.topic || !formData.date || !formData.start_time || !formData.end_time) {
      setMessage("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/appointment",
        {
          tutor_id: selectedTutor.user_id,
          ...formData
        },
        {
          headers: { token }
        }
      );

      setMessage("Appointment created successfully!");
      setFormData({
        subject: "",
        topic: "",
        mode_of_session: "Face-to-Face",
        date: "",
        start_time: "",
        end_time: ""
      });
      setSelectedTutor(null);
    } catch (err) {
      console.error(err.message);
      setMessage("Error creating appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTutors();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-[#132c91] font-bold text-2xl">Appointment</h1>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-9">
        <div className="bg-[#fafafa] p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="flex justify-between flex-col gap-2">
            <label>Select Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
            <label>Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
            <label>Mode of Session</label>
            <select 
              name="mode_of_session"
              value={formData.mode_of_session}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="Face-to-Face">Face-to-Face</option>
              <option value="Online">Online</option>
            </select>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
            <label>Start Time</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
            <label>End Time</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-[#132c91] text-white rounded-md p-2 w-full disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Appointment"}
            </button>
          </form>
        </div>

        {/* List of Tutors */}
        <div className="bg-[#fafafa] p-8 rounded-lg shadow-md h-[500px] overflow-y-auto">
          <div className="mb-4">
            <p className="text-lg font-bold text-[#132c91]">Tutors</p>
          </div>
          <div className="flex justify-between flex-col gap-4">
            {tutors.map((tutor) => (
              <div key={tutor.user_id} className="p-3 bg-[#d9d9d9] rounded-md">
                <p className="font-semibold">{tutor.user_name}</p>
                <p>Rating: 4.5</p>
                <p>Available</p>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => getTutorDetails(tutor.user_id)} 
                    className="bg-[#132c91] text-white rounded-md p-2 text-sm"
                  >
                    See Details
                  </button>
                  <button 
                    onClick={() => handleTutorSelect(tutor)}
                    className={`rounded-md p-2 text-sm ${
                      selectedTutor?.user_id === tutor.user_id 
                        ? "bg-green-600 text-white" 
                        : "bg-[#f7c004] text-white"
                    }`}
                  >
                    {selectedTutor?.user_id === tutor.user_id ? "Selected" : "Select"}
                  </button>
                </div>
                
                {/* Tutor Details */}
                {tutorDetails[tutor.user_id] && (
                  <div className="mt-3 p-2 bg-white rounded-md text-sm">
                    <p><strong>Program:</strong> {tutorDetails[tutor.user_id].program || "Not specified"}</p>
                    <p><strong>College:</strong> {tutorDetails[tutor.user_id].college || "Not specified"}</p>
                    <p><strong>Year Level:</strong> {tutorDetails[tutor.user_id].year_level || "Not specified"}</p>
                    <p><strong>Specialization:</strong> {tutorDetails[tutor.user_id].specialization || "Not specified"}</p>
                    <p><strong>Topics:</strong> {tutorDetails[tutor.user_id].topics || "Not specified"}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
