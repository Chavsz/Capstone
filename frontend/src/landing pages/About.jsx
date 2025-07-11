import React, { useState, useEffect } from 'react';
import axios from 'axios';

function About() {
  const [landingData, setLandingData] = useState({
    about_image: '',
    about_title: '',
    about_description: '',
    about_link: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/landing')  
      .then(response => {
        setLandingData(response.data);
      })
      .catch(error => console.error('Error fetching landing data:', error));
  }, []);

  return (
    <section id="Home" className="min-h-screen flex items-center justify-between bg-[#ffffff] p-10">
     
      <div className="w-3/4">
        <img
          // Ensure correct path to the image
          src={`http://localhost:5000${landingData.about_image || '/uploads/landing/placeholder.png'}`}
          alt="Home"
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>

      
      <div className="w-1/2 flex flex-col justify-center pl-10 space-y-5">
        <h1 className="text-4xl font-bold text-gray-800">{landingData.about_title}</h1>
        <p className="text-lg text-gray-600">{landingData.about_description}</p>
       
         <a
        href={landingData.about_link}// 
        style={{
          display: 'inline-block',
          backgroundColor: '#4257a9', // 
          color: 'white',
          textAlign: 'center',
          padding: '12px 10px',
          fontSize: '16px',
          fontWeight: 'bold',
          textDecoration: 'none', 
          borderRadius: '100px', 
          width: '200px',
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#4e69a2')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#3b5998')}
      >
        Visit our FB Page
      </a>
      </div>
    </section>
  );
}

export default About
