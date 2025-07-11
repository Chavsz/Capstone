import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const Profile = () => {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState({
    program: "",
    college: "",
    year_level: "",
    specialization: "",
    topics: "",
    profile_image: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(profile);
  const [schedules, setSchedules] = useState([]);
  const [scheduleEditDay, setScheduleEditDay] = useState(null);
  const [newTime, setNewTime] = useState({ start: "", end: "" });
  const [loadingSchedules, setLoadingSchedules] = useState(false);


  async function getName() {
    try {
      const response = await axios.get("http://localhost:5000/dashboard", {
        headers: { token: localStorage.getItem("token") },
      });
      setName(response.data.user_name);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getProfile() {
    try {
      const response = await axios.get("http://localhost:5000/dashboard/profile", {
        headers: { token: localStorage.getItem("token") },
      });
      setProfile(response.data || {});
      setForm(response.data || {});
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getSchedules() {
    setLoadingSchedules(true);
    try {
      const response = await axios.get("http://localhost:5000/dashboard/schedule", {
        headers: { token: localStorage.getItem("token") },
      });
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
    acc[day] = schedules.filter(s => s.day === day);
    return acc;
  }, {});

  // Add new time slot
  const handleAddTime = async (day) => {
    if (!newTime.start || !newTime.end) return;
    try {
      await axios.post("http://localhost:5000/dashboard/schedule", {
        day,
        start_time: newTime.start,
        end_time: newTime.end,
      }, { headers: { token: localStorage.getItem("token") } });
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
        headers: { token: localStorage.getItem("token") }
      });
      getSchedules();
    } catch (err) {
      console.error(err.message);
    }
  };

  // Edit time slot
  const handleEditTime = async (id, start, end) => {
    try {
      await axios.put(`http://localhost:5000/dashboard/schedule/${id}`, {
        day: scheduleEditDay,
        start_time: start,
        end_time: end,
      }, { headers: { token: localStorage.getItem("token") } });
      setScheduleEditDay(null);
      getSchedules();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:5000/dashboard/profile",
        form,
        { headers: { token: localStorage.getItem("token") } }
      );
      setProfile(form);
      setEditMode(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload/profile-image",
        formData,
        { 
          headers: { 
            token: localStorage.getItem("token"),
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      // Update the profile with the new image URL
      setProfile(prev => ({ ...prev, profile_image: response.data.imageUrl }));
      setForm(prev => ({ ...prev, profile_image: response.data.imageUrl }));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1>Profile</h1>
      <div className="mt-6 rounded-md bg-[#f4ece6] p-6 w-[400px]">
        <p><b>Name:</b> {name}</p>
        {editMode ? (
          <div className="space-y-2 mt-4">
            <input
              type="text"
              name="program"
              placeholder="Program"
              value={form.program || ""}
              onChange={handleChange}
              className="block border p-1 w-full"
            />
            <input
              type="text"
              name="college"
              placeholder="College"
              value={form.college || ""}
              onChange={handleChange}
              className="block border p-1 w-full"
            />
            <input
              type="text"
              name="year_level"
              placeholder="Year Level"
              value={form.year_level || ""}
              onChange={handleChange}
              className="block border p-1 w-full"
            />
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={form.specialization || ""}
              onChange={handleChange}
              className="block border p-1 w-full"
            />
            <input
              type="text"
              name="topics"
              placeholder="Topics"
              value={form.topics || ""}
              onChange={handleChange}
              className="block border p-1 w-full"
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Profile Image</label>
              <input
                type="file"
                name="profile_image"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button onClick={handleSave} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        ) : (
          <div className="space-y-2 mt-4">
            {profile.profile_image && (
              <div className="mb-4">
                <img 
                  src={`http://localhost:5000${profile.profile_image}`} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                />
              </div>
            )}
            <p><b>Program:</b> {profile.program || "-"}</p>
            <p><b>College:</b> {profile.college || "-"}</p>
            <p><b>Year Level:</b> {profile.year_level || "-"}</p>
            <p><b>Specialization:</b> {profile.specialization || "-"}</p>
            <p><b>Topics:</b> {profile.topics || "-"}</p>

            <div className="flex gap-2">
              <button onClick={handleEdit} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Edit Profile</button>
              {/* <label className="mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label> */}
            </div>

          </div>
        )}
      </div>
      {/* Schedules UI */}
      <div className="mt-8 rounded-md bg-[#f4f8ec] p-6 w-[500px]">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold text-blue-900 flex-1">Schedules Available</h2>
          <span className="text-blue-900 text-2xl ml-2">✔️</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {daysOfWeek.map(day => (
            <div key={day} className="flex items-center gap-2">
              <span className="font-bold text-blue-900 w-24">{day}</span>
              <div className="flex-1 flex flex-wrap gap-2">
                {schedulesByDay[day] && schedulesByDay[day].length > 0 ? (
                  schedulesByDay[day].map(slot => (
                    <div key={slot.schedule_id} className="flex items-center bg-white border rounded px-2 py-1 gap-1 shadow-sm">
                      <span className="font-mono text-sm">{slot.start_time.slice(0,5)} - {slot.end_time.slice(0,5)}</span>
                      <button onClick={() => handleDeleteTime(slot.schedule_id)} className="text-red-500 hover:text-red-700 ml-1" title="Delete"><FaTrash size={14} /></button>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400">No schedule</span>
                )}
                {scheduleEditDay === day ? (
                  <>
                    <input
                      type="time"
                      value={newTime.start}
                      onChange={e => setNewTime({ ...newTime, start: e.target.value })}
                      className="border rounded px-1 text-sm"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={newTime.end}
                      onChange={e => setNewTime({ ...newTime, end: e.target.value })}
                      className="border rounded px-1 text-sm"
                    />
                    <button onClick={() => handleAddTime(day)} className="text-green-600 ml-1" title="Add"><FaPlus size={16} /></button>
                    <button onClick={() => { setScheduleEditDay(null); setNewTime({ start: "", end: "" }); }} className="ml-1 text-gray-500">Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setScheduleEditDay(day)} className="ml-2 text-blue-700 hover:text-blue-900" title="Add time slot"><FaEdit size={16} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
        {loadingSchedules && <div className="text-gray-500 mt-2">Loading schedules...</div>}
      </div>
    </div>
  );
};

export default Profile;
