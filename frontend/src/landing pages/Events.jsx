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
        <h1 className="text-3xl font-bold text-center text-black mb-8">Upcoming Events</h1>

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
                <div key={event.id} className="event-card bg-white border-2 border-[#feda3c] rounded-lg shadow-lg overflow-hidden p-5">
                  {/* Event Title */}
                  <h2 className="text-xl font-bold text-center text-black mb-4">{event.event_title}</h2>

                  {/* Event Image */}
                  <div className="event-image mb-4">
                    <img
                      src={`http://localhost:5000${event.event_image || '/uploads/landing/placeholder.png'}`} // Ensure correct path to the image
                      alt={event.event_title}
                      className="w-full h-70 object-cover rounded-md border-2 border-[#2c291c]"
                    />
                  </div>

                  {/* Event Content */}
                  <div className="event-content">
                    <p className="text-center text-gray-600 mb-4">{event.event_description}</p>

                    <div className="event-details text-center text-sm text-gray-500">
                      <p><strong>Date:</strong> {formattedDate}</p>
                      <p><strong>Time:</strong> {event.event_time}</p>
                      <p><strong>Location:</strong> {event.event_location}</p>
                    </div>
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

export default Events;
