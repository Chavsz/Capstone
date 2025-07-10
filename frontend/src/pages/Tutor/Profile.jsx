import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState({
    program: "",
    college: "",
    year_level: "",
    specialization: "",
    topics: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(profile);


  

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

  useEffect(() => {
    getName();
    getProfile();
  }, []);

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

  return (
    <div className="min-h-screen bg-white p-6">
      <h1>Profile</h1>
      <div className="mt-6 rounded-md bg-[#f4ece6] p-6">
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
            <button onClick={handleSave} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        ) : (
          <div className="space-y-2 mt-4">
            <p><b>Program:</b> {profile.program || "-"}</p>
            <p><b>College:</b> {profile.college || "-"}</p>
            <p><b>Year Level:</b> {profile.year_level || "-"}</p>
            <p><b>Specialization:</b> {profile.specialization || "-"}</p>
            <p><b>Topics:</b> {profile.topics || "-"}</p>
            <button onClick={handleEdit} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
