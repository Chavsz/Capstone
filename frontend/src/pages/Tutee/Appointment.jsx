import { useState, useEffect } from "react";
import axios from "axios";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";

const Appointment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tutors, setTutors] = useState([]);
  const [tutorDetails, setTutorDetails] = useState({});
  const [tutorSchedules, setTutorSchedules] = useState({});
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    mode_of_session: "",
    date: "",
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  const subjects = ["Programming", "Calculus", "Chemistry", "Physics"];

  const getTutors = async () => {
    try {
      setLoadingProfiles(true);
      const response = await axios.get(`http://localhost:5000/users/tutor`);
      setTutors(response.data);

      // Fetch profiles for all tutors immediately
      const profilePromises = response.data.map(async (tutor) => {
        try {
          const profileResponse = await axios.get(
            `http://localhost:5000/profile/${tutor.user_id}`
          );
          if (profileResponse.data && profileResponse.data.length > 0) {
            return { tutorId: tutor.user_id, profile: profileResponse.data[0] };
          }
        } catch (err) {
          console.error(
            `Error fetching profile for tutor ${tutor.user_id}:`,
            err.message
          );
        }
        return null;
      });

      const profileResults = await Promise.all(profilePromises);
      const profilesMap = {};
      profileResults.forEach((result) => {
        if (result) {
          profilesMap[result.tutorId] = result.profile;
        }
      });

      setTutorDetails(profilesMap);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const getTutorDetails = async (tutorId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/profile/${tutorId}`
      );
      if (response.data && response.data.length > 0) {
        setTutorDetails((prev) => ({
          ...prev,
          [tutorId]: response.data[0],
        }));
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getTutorSchedules = async (tutorId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/dashboard/schedule/${tutorId}`
      );
      setTutorSchedules((prev) => ({
        ...prev,
        [tutorId]: response.data,
      }));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Prevent selecting Saturdays (6) and Sundays (0)
  const handleDateChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setFormData({ ...formData, date: "" });
      return;
    }
    const selected = new Date(`${value}T00:00:00`);
    const day = selected.getDay();
    if (day === 0 || day === 6) {
      toast.error("Weekends are not available.");
      setFormData({ ...formData, date: "" });
      e.target.value = "";
      return;
    }
    setFormData({ ...formData, date: value });
  };

  const handleTimeChange = (field, value) => {
    if (value && value.isValid()) {
      setFormData({
        ...formData,
        [field]: value.format("HH:mm"),
      });
    } else {
      setFormData({
        ...formData,
        [field]: "",
      });
    }
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setFormData({
      ...formData,
      subject: subject,
    });
    setSelectedTutor(null); // Reset selected tutor when subject changes
  };

  const handleTutorSelect = (tutor) => {
    setSelectedTutor(tutor);
    // Profiles are already loaded, only fetch schedules if not already loaded
    if (!tutorSchedules[tutor.user_id]) {
      getTutorSchedules(tutor.user_id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTutor) {
      toast.error("Please select a tutor first");
      return;
    }

    if (
      !formData.subject ||
      !formData.topic ||
      !formData.date ||
      !formData.start_time ||
      !formData.end_time
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Extra guard: prevent booking on weekends
    const selected = new Date(`${formData.date}T00:00:00`);
    const day = selected.getDay();
    if (day === 0 || day === 6) {
      toast.error("Selected date falls on a weekend. Please choose a weekday.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/appointment",
        {
          tutor_id: selectedTutor.user_id,
          ...formData,
        },
        {
          headers: { token },
        }
      );

      toast.success("Appointment created successfully!");
      setFormData({
        subject: "",
        topic: "",
        mode_of_session: "",
        date: "",
        start_time: "",
        end_time: "",
      });
      setSelectedTutor(null);
      setSelectedSubject("");
    } catch (err) {
      console.error(err.message);
      toast.success("Error creating appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTutors();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter tutors by selected subject and search term
  const filteredTutors = tutors.filter((tutor) => {
    const tutorSpecialization =
      tutorDetails[tutor.user_id]?.specialization || "";
    const matchesSubject =
      !selectedSubject ||
      tutorSpecialization.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesSearch = tutor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Helper function to get schedules for a specific day
  const getSchedulesForDay = (tutorId, day) => {
    const schedules = tutorSchedules[tutorId] || [];
    return schedules.filter((schedule) => schedule.day === day);
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="py-3 px-6 bg-white">
      <h1 className="text-blue-600 font-bold text-2xl mb-6">
        Make Appointment
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
        {/* Left Panel - Appointment Form */}
        <div className="bg-[#fafafa] p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Choose Subject */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Choose Subject</h3>
              <div className="flex gap-3 flex-wrap">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectSelect(subject)}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      selectedSubject === subject
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Topic</h3>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="Enter topic"
                className="border border-gray-300 rounded-md p-3 w-full"
                required
              />
            </div>

            {/* Mode of Session */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Mode of Session</h3>
              <select
                name="mode_of_session"
                value={formData.mode_of_session}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-3 w-[280px]"
                required
              >
                <option value="Face-to-Face">Face-to-Face</option>
                <option value="Online">Online</option>
              </select>
            </div>

            {/* Choose Date and Time */}
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Choose Date and Time
              </h3>
              <div className="space-y-3">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleDateChange}
                  className="border border-gray-300 rounded-md p-3 w-full"
                  required
                />
                {/* time picker */}
                <div className="flex gap-3">
                  {/* start time */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["TimePicker"]}>
                      <TimePicker
                        value={
                          formData.start_time
                            ? dayjs(`2000-01-01T${formData.start_time}`)
                            : null
                        }
                        onChange={(value) =>
                          handleTimeChange("start_time", value)
                        }
                        label="Start Time"
                      />
                    </DemoContainer>
                  </LocalizationProvider>

                  {/* end time */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["TimePicker"]}>
                      <TimePicker
                        value={
                          formData.end_time
                            ? dayjs(`2000-01-01T${formData.end_time}`)
                            : null
                        }
                        onChange={(value) =>
                          handleTimeChange("end_time", value)
                        }
                        label="End Time"
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
            </div>

            {/* Choose Tutor */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg">Choose Tutor</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Search Tutors */}
              <input
                type="text"
                placeholder="Search tutors..."
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-300 rounded-md p-3 w-full mb-4"
              />

              {/* Tutor Grid */}
              {loadingProfiles ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading tutors...</div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredTutors.slice(0, 4).map((tutor) => (
                    <div
                      key={tutor.user_id}
                      onClick={() => handleTutorSelect(tutor)}
                      className={`p-4 rounded-md border cursor-pointer transition-colors ${
                        selectedTutor?.user_id === tutor.user_id
                          ? "bg-blue-50 border-blue-500"
                          : "bg-white border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gray-300 rounded-full mb-2 flex items-center justify-center">
                          <span className="text-gray-600 text-sm">👤</span>
                        </div>
                        <p className="font-medium text-sm">{tutor.name}</p>
                        <p className="text-xs text-gray-600">
                          {tutorDetails[tutor.user_id]?.specialization ||
                            "No specialization"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Book Appointment Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#132c91] text-white rounded-md p-3 w-full disabled:opacity-50 hover:bg-[#0f1f6b] transition-colors"
            >
              {loading ? "Creating..." : "Book Appointment"}
            </button>
          </form>
        </div>

        {/* Right Panel - Tutor Details */}
        <div className="bg-[#fafafa] p-8 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg mb-6">Tutor Details</h3>

          {selectedTutor ? (
            <div className="space-y-6">
              {/* Tutor Profile */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-gray-600 text-2xl">👤</span>
                </div>
                <p className="font-semibold text-lg">{selectedTutor.name}</p>
                <p className="text-gray-600">
                  {tutorDetails[selectedTutor.user_id]?.college ||
                    "College not specified"}
                </p>
                <p className="text-gray-600">
                  {tutorDetails[selectedTutor.user_id]?.specialization ||
                    "No specialization"}
                </p>
                <p className="text-gray-600">
                  {tutorDetails[selectedTutor.user_id]?.topics ||
                    "Topics not specified"}
                </p>
              </div>

              {/* Available Schedules */}
              <div>
                <h4 className="font-semibold text-lg mb-4">
                  Available Schedules
                </h4>
                <div className="space-y-3">
                  {daysOfWeek.map((day) => {
                    const daySchedules = getSchedulesForDay(
                      selectedTutor.user_id,
                      day
                    );
                    return (
                      <div
                        key={day}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium">{day}</span>
                        {daySchedules.length > 0 ? (
                          <div className="flex gap-2">
                            {daySchedules.map((schedule, index) => (
                              <span
                                key={index}
                                className="bg-gray-200 px-3 py-1 rounded text-sm"
                              >
                                {formatTime(schedule.start_time)} -{" "}
                                {formatTime(schedule.end_time)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No schedule
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-lg">Select a tutor</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointment;
