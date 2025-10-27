import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const Profile = () => {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState({
    nickname: "",
    program: "",
    college: "",
    year_level: "",
    subject: "",
    specialization: "",
    profile_image: "",
    online_link: "",
    file_link: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState(profile);
  const [schedules, setSchedules] = useState([]);
  const [scheduleEditDay, setScheduleEditDay] = useState(null);
  const [newTime, setNewTime] = useState({ start: "", end: "" });
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const handleTimeChange = (field, value) => {
    if (value && value.isValid()) {
      setNewTime({
        ...newTime,
        [field]: value.format("HH:mm"),
      });
    } else {
      setNewTime({
        ...newTime,
        [field]: "",
      });
    }
  };

  async function getName() {
    try {
      const response = await axios.get("http://localhost:5000/dashboard", {
        headers: { token: localStorage.getItem("token") },
      });
      setName(response.data.name);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getProfile() {
    try {
      const response = await axios.get(
        "http://localhost:5000/dashboard/profile",
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setProfile(response.data || {});
      setForm(response.data || {});
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getSchedules() {
    setLoadingSchedules(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/dashboard/schedule",
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setSchedules(response.data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoadingSchedules(false);
    }
  }

  useEffect(() => {
    getName();
    getProfile();
    getSchedules();
  }, []);

  // Group schedules by day
  const schedulesByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = schedules.filter((s) => s.day === day);
    return acc;
  }, {});

  // Add new time slot
  const handleAddTime = async (day) => {
    if (!newTime.start || !newTime.end) return;
    try {
      await axios.post(
        "http://localhost:5000/dashboard/schedule",
        {
          day,
          start_time: newTime.start,
          end_time: newTime.end,
        },
        { headers: { token: localStorage.getItem("token") } }
      );
      setNewTime({ start: "", end: "" });
      setScheduleEditDay(null);
      getSchedules();
    } catch (err) {
      console.error(err.message);
    }
  };

  // Delete time slot
  const handleDeleteTime = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/dashboard/schedule/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      getSchedules();
    } catch (err) {
      console.error(err.message);
    }
  };

  // Edit time slot
  const handleEditTime = async (id, start, end) => {
    try {
      await axios.put(
        `http://localhost:5000/dashboard/schedule/${id}`,
        {
          day: scheduleEditDay,
          start_time: start,
          end_time: end,
        },
        { headers: { token: localStorage.getItem("token") } }
      );
      setScheduleEditDay(null);
      getSchedules();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:5000/dashboard/profile", form, {
        headers: { token: localStorage.getItem("token") },
      });
      setProfile(form);
      setShowEditModal(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload/profile-image",
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the profile with the new image URL
      setProfile((prev) => ({
        ...prev,
        profile_image: response.data.imageUrl,
      }));
      setForm((prev) => ({ ...prev, profile_image: response.data.imageUrl }));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white py-3 px-6">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-blue-600 mb-6">My Profile</h1>

      {/* Student Information Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 max-w">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Student Information
          </h2>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            <span>Edit</span>
            <FaEdit size={12} />
          </button>
        </div>

        <div className="">
          {/* Profile Image */}
          <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mb-3">
          {profile.profile_image ? (
            <img
              src={`http://localhost:5000${profile.profile_image}`}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-4xl font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          </div>

          {/* Profile Information */}
          <div className="flex flex-col">
            <div className="space-y-2 ">
              <p>
                <span className="font-semibold">Name:</span> {name}
              </p>
              <p>
                <span className="font-semibold">Nickname:</span>{" "}
                {profile.nickname || ""}
              </p>
              <p>
                <span className="font-semibold">Year:</span>{" "}
                {profile.year_level || ""}
              </p>
              <p>
                <span className="font-semibold">Subject:</span>{" "}
                <span>{profile.subject || ""}</span>
              </p>
              <p>
                <span className="font-semibold">Program Course:</span>{" "}
                {profile.program || ""}
              </p>
              <p>
                <span className="font-semibold">College:</span>{" "}
                {profile.college || ""}
              </p>
              <p>
                <span className="font-semibold">Specialization:</span>{" "}
                <span>{profile.specialization || ""}</span>
              </p>
              <p>
                <span className="font-semibold">Online Link:</span>{" "}
                <span>{profile.online_link || "Not provided"}</span>
              </p>
              <p>
                <span className="font-semibold">File Link:</span>{" "}
                <span>{profile.file_link || "Not provided"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedules Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Schedules</h2>
        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-start gap-4">
              <span className="font-semibold text-gray-900 w-24">{day}</span>
              <div className="flex-1 flex flex-wrap gap-2">
                {schedulesByDay[day] && schedulesByDay[day].length > 0 ? (
                  schedulesByDay[day].map((slot) => (
                    <div
                      key={slot.schedule_id}
                      className="flex items-center bg-white border-1 border-[#c2c2c2] rounded-md px-3 py-1 gap-2"
                    >
                      <span className="text-sm font-mono">
                        {slot.start_time.slice(0, 5)} -{" "}
                        {slot.end_time.slice(0, 5)}
                      </span>
                      <button
                        onClick={() => handleDeleteTime(slot.schedule_id)}
                        className="text-[#c2c2c2]"
                        title="Delete"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400">No schedule</span>
                )}
                {scheduleEditDay === day ? (
                  <div className="flex items-center gap-2">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["TimePicker"]}>
                        <TimePicker
                          value={newTime.start ? dayjs(`2000-01-01T${newTime.start}`) : null}
                          onChange={(value) => handleTimeChange("start", value)}
                          label="Start Time"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "red",
                              },
                              "&:hover fieldset": {
                                borderColor: "red",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "red",
                              },
                            },
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                    <span>-</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["TimePicker"]}>
                        <TimePicker
                          value={newTime.end ? dayjs(`2000-01-01T${newTime.end}`) : null}
                          onChange={(value) => handleTimeChange("end", value)}
                          label="End Time"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "red",
                              },
                              "&:hover fieldset": {
                                borderColor: "red",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "red",
                              },
                            },
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                    <button
                      onClick={() => handleAddTime(day)}
                      className="text-green-600 hover:text-green-700"
                      title="Add"
                    >
                      <FaPlus size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setScheduleEditDay(null);
                        setNewTime({ start: "", end: "" });
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setScheduleEditDay(day)}
                    className="text-blue-700 hover:text-blue-900"
                    title="Add time slot"
                  >
                    <FaEdit size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {loadingSchedules && (
          <div className="text-gray-500 mt-4">Loading schedules...</div>
        )}
      </div>

      {/* Edit Information Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Edit Information
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Image Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                    {form.profile_image ? (
                      <img
                        src={`http://localhost:5000${form.profile_image}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      name="profile_image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-sm text-gray-500 mt-1 ml-2">
                      Upload new a profile image
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    disabled
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nickname
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={form.nickname || ""}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    name="year_level"
                    value={form.year_level || ""}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject || ""}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program Course
                  </label>
                  <input
                    type="text"
                    name="program"
                    value={form.program || ""}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={form.college || ""}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={form.specialization || ""}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Online Link
                  </label>
                  <input
                    type="url"
                    name="online_link"
                    value={form.online_link || ""}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/your-meeting-link"
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Link
                  </label>
                  <input
                    type="url"
                    name="file_link"
                    value={form.file_link || ""}
                    onChange={handleChange}
                    // placeholder="https://drive.google.com/file/d/your-file-id/view?usp=sharing"
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
