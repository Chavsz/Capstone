import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Events() {
  const [events, setEvents] = useState([]); 

  // Fetch events data from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/event')  
      .then(response => {
        setEvents(response.data);  
      })
      .catch(error => console.error('Error fetching events data:', error));
  }, []);

  return (
    <section id="events" className="min-h-screen flex items-center justify-center bg-[#feda3c] py-10 px-5">
  <div className="container mx-auto">
    <h1 className="text-3xl font-bold text-center mb-8">Upcoming Events</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.length > 0 ? (
        events.map((event) => {
          // Format the event date
          const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          // Return JSX for each event
          return (
            <div key={event.id} className="event-card border rounded-lg shadow-lg overflow-hidden">
              {/* Event Image */}
              <div className="event-image mb-4">
                <img
                  src={`http://localhost:5000${event.event_image || '/uploads/landing/placeholder.png'}`} // Ensure correct path to the image
                  alt={event.event_title}
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>

              {/* Event Content */}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{event.event_title}</h2>
                <p className="text-gray-600 mt-2">{event.event_description}</p>
                <p className="text-sm text-gray-500 mt-2"><strong>Time:</strong> {event.event_time}</p>
                <p className="text-sm text-gray-500 mt-1"><strong>Date:</strong> {formattedDate}</p>
                <p className="text-sm text-gray-500 mt-1"><strong>Location:</strong> {event.event_location}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-600">No events available.</p>
      )}
    </div>
  </div>
</section>
  );
}

export default Events
