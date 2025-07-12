import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Event = () => {
  // State for storing event details from form
  const [formData, setFormData] = useState({
    event_title: '',
    event_description: '',
    event_time: '',
    event_date: '',
    event_location: '',
    event_image: null
  });

  const [events, setEvents] = useState([]);

  const [editingEvent, setEditingEvent] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      event_image: e.target.files[0]
    });
  };

  useEffect(() => {
    axios.get('http://localhost:5000/event')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []); 

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('event_title', formData.event_title);
    form.append('event_description', formData.event_description);
    form.append('event_time', formData.event_time);
    form.append('event_date', formData.event_date);
    form.append('event_location', formData.event_location);
    form.append('event_image', formData.event_image);

    if (editingEvent) {
      axios.put(`http://localhost:5000/event/${editingEvent.id}`, form)
        .then(response => {
          setEvents(events.map(event => event.id === editingEvent.id ? response.data.event : event));
          setEditingEvent(null);  
          setFormData({
            event_title: '',
            event_description: '',
            event_time: '',
            event_date: '',
            event_location: '',
            event_image: null
          });
        })
        .catch(error => {
          console.error('Error updating event:', error);
        });
    } else {
      
      axios.post('http://localhost:5000/event', form)
        .then(response => {
          setEvents([...events, response.data.event]);
          setFormData({
            event_title: '',
            event_description: '',
            event_time: '',
            event_date: '',
            event_location: '',
            event_image: null
          });
        })
        .catch(error => {
          console.error('Error creating event:', error);
        });
    }
  };

  // Handle edit button click
  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      event_title: event.event_title,
      event_description: event.event_description,
      event_time: event.event_time,
      event_date: event.event_date,
      event_location: event.event_location,
      event_image: null  
    });
  };

  // Handle delete button click
  const handleDelete = (eventId) => {
    axios.delete(`http://localhost:5000/event/${eventId}`)
      .then(() => {
        setEvents(events.filter(event => event.id !== eventId)); 
      })
      .catch(error => {
        console.error('Error deleting event:', error);
      });
  };

  return (
    <div className="min-h-screen flex-1 flex flex-col items-center justify-center bg-white">
      <h1>Event/Announcements</h1>

      {/* Add or Edit Event Form */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center mt-6">
        <input
          type="text"
          name="event_title"
          placeholder="Event Title"
          value={formData.event_title}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <textarea
          name="event_description"
          placeholder="Event Description"
          value={formData.event_description}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="time"
          name="event_time"
          value={formData.event_time}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          name="event_date"
          value={formData.event_date}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="event_location"
          placeholder="Event Location"
          value={formData.event_location}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          name="event_image"
          onChange={handleFileChange}
          className="mb-2"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          {editingEvent ? 'Update Event' : 'Add Event'}
        </button>
      </form>

      {/* Display Events */}
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

                return (
                  <div key={event.id} className="event-card border rounded-lg shadow-lg overflow-hidden">
                    {/* Event Image */}
                    <div className="event-image mb-4">
                      <img
                        src={`http://localhost:5000${event.event_image || '/uploads/landing/placeholder.png'}`}
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

                      {/* Edit and Delete buttons */}
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
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
    </div>
  );
};

export default Event;
