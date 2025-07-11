import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Landing = () => {
  const [landingData, setLandingData] = useState(null);  
  const [formData, setFormData] = useState({
    home_image: null,  
    home_title: '',
    home_description: '',
    home_more: '',
    about_image: null,
    about_title: '',
    about_description: '',
    about_link: ''
  });
  const [isSaving, setIsSaving] = useState(false); 
  const [successMessage, setSuccessMessage] = useState('');  

  useEffect(() => {
    axios.get('http://localhost:5000/landing') 
      .then(response => {
        setLandingData(response.data);  
        setFormData({
          home_image: response.data.home_image,
          home_title: response.data.home_title,
          home_description: response.data.home_description,
          home_more: response.data.home_more,
          about_image: response.data.about_image,
          about_title: response.data.about_title,
          about_description: response.data.about_description,
          about_link: response.data.about_link
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "home_image" || name === "about_image") {
      setFormData(prevData => ({
        ...prevData,
        [name]: files[0]  
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value  
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);  

    const form = new FormData();
    form.append('home_image', formData.home_image); 
    form.append('home_title', formData.home_title);
    form.append('home_description', formData.home_description);
    form.append('home_more', formData.home_more);
    form.append('about_image', formData.about_image); 
    form.append('about_title', formData.about_title);
    form.append('about_description', formData.about_description);
    form.append('about_link', formData.about_link);

    axios.post('http://localhost:5000/landing', form)
      .then(response => {
        console.log('Landing data updated:', response.data);
        setLandingData(response.data);  
        setSuccessMessage('Changes saved successfully!');  
      })
      .catch(error => {
        console.error('Error saving data:', error);
        setSuccessMessage('Failed to save changes.'); 
      })
      .finally(() => {
        setIsSaving(false);  
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Landing Page Settings</h1>
     
      {successMessage && <p className="text-center text-green-500">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="home_title" className="block text-sm font-semibold text-gray-700">Home Title:</label>
          <input
            type="text"
            name="home_title"
            value={formData.home_title}
            onChange={handleChange}
            placeholder="Enter Home Title"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="home_description" className="block text-sm font-semibold text-gray-700">Home Description:</label>
          <textarea
            name="home_description"
            value={formData.home_description}
            onChange={handleChange}
            placeholder="Enter Home Description"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="home_more" className="block text-sm font-semibold text-gray-700"> More:</label>
          <input
            type="text"
            name="home_more"
            value={formData.home_more}
            onChange={handleChange}
            placeholder="Enter Learn More Text"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="home_image" className="block text-sm font-semibold text-gray-700">Home Image Upload:</label>
          <input
            type="file"
            name="home_image"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="about_title" className="block text-sm font-semibold text-gray-700">About Title:</label>
          <input
            type="text"
            name="about_title"
            value={formData.about_title}
            onChange={handleChange}
            placeholder="Enter About Title"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="about_description" className="block text-sm font-semibold text-gray-700">About Description:</label>
          <textarea
            name="about_description"
            value={formData.about_description}
            onChange={handleChange}
            placeholder="Enter About Description"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="about_link" className="block text-sm font-semibold text-gray-700">About Link:</label>
          <input
            type="url"
            name="about_link"
            value={formData.about_link}
            onChange={handleChange}
            placeholder="Enter About Link"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="about_image" className="block text-sm font-semibold text-gray-700">About Image Upload:</label>
          <input
            type="file"
            name="about_image"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full p-3 bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Landing;
