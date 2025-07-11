import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [landingData, setLandingData] = useState({
    home_image: '',
    home_title: '',
    home_description: '',
    home_more: ''
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
     
      <div className="w-2/5">
        <img
          // Ensure correct path to the image
          src={`http://localhost:5000${landingData.home_image || '/uploads/landing/placeholder.png'}`}
          alt="Home"
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>

      
      <div className="w-1/2 flex flex-col justify-center pl-10 space-y-5">
        <h1 className="text-4xl font-bold text-gray-800">{landingData.home_title}</h1>
        <p className="text-lg text-gray-600">{landingData.home_description}</p>
        <p className="text-black-600 text-lg font-semibold">{landingData.home_more}</p>
        <p className="text-black-100 text-lg ">Want to appoint a tutorial session?</p>
         <a
        href="http://localhost:5173/register" // 
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
        Get Started!
      </a>
      </div>
    </section>
  );
}

export default Home
