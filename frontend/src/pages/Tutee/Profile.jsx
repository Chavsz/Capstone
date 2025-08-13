import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTimes } from "react-icons/fa";

const Profile = () => {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState({
    program: "",
    college: "",
    year_level: "",
    profile_image: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState(profile);

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

  useEffect(() => {
    getName();
    getProfile();
  }, []);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:5000/dashboard/profile/student", form, {
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
    <div className="py-3 px-6 bg-white">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-blue-900 mb-6">My Profile</h1>

      {/* Student Information Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 max-w-full">
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
                <span className="font-semibold">Year:</span>{" "}
                {profile.year_level || "-"}
              </p>
              <p>
                <span className="font-semibold">Program Course:</span>{" "}
                <span>{profile.program || "-"}</span>
              </p>
              <p>
                <span className="font-semibold">College:</span>{" "}
                {profile.college || "-"}
              </p>
            </div>
          </div>
        </div>
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
                      Upload a new profile picture
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
                    Year Level
                  </label>
                  <select
                    name="year_level"
                    value={form.year_level || ""}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select Year Level</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program/Course
                  </label>
                  <input
                    type="text"
                    name="program"
                    value={form.program || ""}
                    onChange={handleChange}
                    placeholder="BSIT"
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College
                  </label>
                  <select
                    name="college"
                    value={form.college || ""}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select College</option>
                    <option value="College of Engineering">
                      College of Engineering
                    </option>
                    <option value="College of Arts and Social Sciences">
                      College of Arts and Social Sciences
                    </option>
                    <option value="College of Computer Studies">
                      College of Computer Studies
                    </option>
                    <option value="College of Education">
                      College of Education
                    </option>
                    <option value="College of Health and Sciences">
                      College of Health and Sciences
                    </option>
                    <option value="College of Economics, Business, and Accountancy">
                      College of Economics, Business, and Accountancy
                    </option>
                    <option value="College of Science and Mathematics">
                      College of Science and Mathematics
                    </option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
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
