// src/pages/OrganizerDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [editingEventId, setEditingEventId] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '', date: '', time: '', venue: '', description: '', register: '',
  });

  const token = localStorage.getItem('token');

  const venueOptions = [
    'JNTUH CSE Department',
    'JNTUH ECE Department',
    'JNTUH EEE Department',
    'JNTUH Mechanical Department',
    'JNTUH Civil Department',
    'JNTUH Metallurgy Department',
    'JNTUH Classroom Complex (CRC)',
    'JNTUH Examination Building',
    'JNTUH Central Library',
    'JNTUH Innovation Foundation (JTBI)',
    'JNTUH Canteen',
    'JNTUH Research and Development Cell',
    'JNTUH College Ground',
    'JNTUH Auditorium',
    'JNTUH Guest House',
    'JNTUH UGC',
    'JNTUH Namaz Hall',
    'JNTUH Main Building',
    'JNTUH Administrative Building',
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/api/events/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setEvents(res.data.events))
      .catch(err => console.error(err));
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingEventId) {
      // EDIT MODE → PUT request
      axios.put(`http://localhost:5000/api/events/${editingEventId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          alert(res.data.message);
          setEditingEventId(null);
          setFormData({
            eventName: '', date: '', time: '', venue: '', description: '', register: '',
          });
          window.location.reload();
        })
        .catch(err => alert('Event update failed'));
    } else {
      // CREATE MODE → POST request
      axios.post('http://localhost:5000/api/events/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          alert(res.data.message);
          setFormData({
            eventName: '', date: '', time: '', venue: '', description: '', register: '',
          });
          window.location.reload();
        })
        .catch(err => alert('Event creation failed'));
    }
  };


  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const now = new Date();

  const upcomingEvents = events.filter(event => {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    return eventDateTime >= now;
  });

  const completedEvents = events.filter(event => {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    return eventDateTime < now;
  });

  useEffect(() => {
    let lastPopStateUrl = window.location.href;
    const handlePopState = (event) => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastPopStateUrl) {
        const historyState = event.state;
        if (historyState === null || historyState?.idx < window.history.state?.idx) {
          localStorage.clear();
        }
        lastPopStateUrl = currentUrl;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Helper to calculate min time (hh:mm) at least 1 hour from now, but only if today
  const getMinTime = () => {
    const selectedDate = new Date(formData.date);
    const today = new Date();

    if (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    ) {
      // Same day → set min time +1 hour
      const oneHourLater = new Date();
      oneHourLater.setHours(oneHourLater.getHours() + 1);

      const hours = String(oneHourLater.getHours()).padStart(2, '0');
      const minutes = String(oneHourLater.getMinutes()).padStart(2, '0');

      return `${hours}:${minutes}`;
    } else {
      // Future date → no min time
      return '';
    }
  };

  const handleEdit = (event) => {
    setEditingEventId(event._id);
    setFormData({
      eventName: event.eventName,
      date: event.date,
      time: event.time,
      venue: event.venue,
      description: event.description,
      register: event.register,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to form
  };


  const handleNotify = (eventId) => {
    if (window.confirm('Are you sure you want to notify all participants about this event?')) {
      axios.post(`http://localhost:5000/api/events/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          alert(res.data.message);
        })
        .catch(err => {
          console.error(err);
          alert('Failed to notify participants.');
        });
    }
  };


  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      axios.delete(`http://localhost:5000/api/events/$id`);

    }
  };


  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary text-center w-100">Organizer Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-danger btn-sm ms-2">
          Logout
        </button>
      </div>
      {/* Create Event Form */}
      <div className="card shadow-sm mb-5">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Create New Event</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label htmlFor="eventName" className="form-label">Event Name</label>
              <input
                id="eventName"
                name="eventName"
                className="form-control"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="Enter event name"
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                id="date"
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="time" className="form-label">Time</label>
              <input
                id="time"
                type="time"
                name="time"
                className="form-control"
                value={formData.time}
                onChange={handleChange}
                min={getMinTime()}
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="description" className="form-label">Event Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="col-12">
              <label htmlFor="venue" className="form-label">Venue</label>
              <select
                id="venue"
                name="venue"
                className="form-select"
                value={formData.venue}
                onChange={handleChange}
                required
              >
                <option value="">-- Select a venue --</option>
                {venueOptions.map((venue, index) => (
                  <option key={index} value={venue}>{venue}</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="register" className="form-label">Registration Link</label>
              <input
                id="register"
                name="register"
                className="form-control"
                value={formData.register}
                onChange={handleChange}
                placeholder="Enter registration link"
                required
              />
            </div>
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-success px-4">
                {editingEventId ? 'Save Changes' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mb-5">
        <h3 className="mb-3 text-success">Upcoming Events</h3>
        {upcomingEvents.length === 0 ? (
          <p className="text-muted">No upcoming events.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {upcomingEvents.map(event => (
              <div key={event._id} className="col">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{event.eventName}</h5>
                    <p className="card-text mb-1"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p className="card-text mb-1"><strong>Time:</strong> {event.time}</p>
                    <p className="card-text mb-1"><strong>Venue:</strong> {event.venue}</p>
                    <p className="card-text mb-1"><strong>Register:</strong> <a href={event.register}>Registration Link</a></p>
                    <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
                      <button className="btn btn-outline-warning btn-sm" onClick={() => handleEdit(event)}>
                        ✏️ Edit
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(event._id)}>
                        🗑️ Delete
                      </button>
                      <button className="btn btn-outline-info btn-sm" onClick={() => handleNotify(event._id)}>
                        📣 Notify
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>

        )}
      </div>

      {/* Completed Events */}
      <div>
        <h3 className="mb-3 text-secondary">Completed Events</h3>
        {completedEvents.length === 0 ? (
          <p className="text-muted">No completed events.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {completedEvents.map(event => (
              <div key={event._id} className="col">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{event.eventName}</h5>
                    <p className="card-text mb-1"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p className="card-text mb-1"><strong>Time:</strong> {event.time}</p>
                    <p className="card-text mb-1"><strong>Venue:</strong> {event.venue}</p>
                    <p className="card-text mb-1"><strong>Description:</strong> {event.description}</p>
                    <p className="card-text mb-1"><strong>Register:</strong> <a href={event.register}>Registration Link</a></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default OrganizerDashboard;