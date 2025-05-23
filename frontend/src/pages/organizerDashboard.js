// src/pages/OrganizerDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: '', date: '', time: '', venue: '', register: '',
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

  // Submit new event
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/events/create', formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        alert(res.data.message);
        window.location.reload(); // refresh event list
      })
      .catch(err => alert('Event creation failed'));
  };

  const handleLogout = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem('token');

    // Redirect to login page
    navigate('/login');
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
                required
              />
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
              <button type="submit" className="btn btn-success px-4">Create Event</button>
            </div>
          </form>
        </div>
      </div>

      {/* List of Created Events */}
      <div>
        <h3 className="mb-3 text-secondary">Your Created Events</h3>
        {events.length === 0 ? (
          <p className="text-muted">No events created yet.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {events.map((event) => (
              <div key={event._id} className="col">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{event.eventName}</h5>
                    <p className="card-text mb-1">
                      <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Time:</strong> {event.time}
                    </p>
                    <p className="card-text mb-0">
                      <strong>Venue:</strong> {event.venue}
                    </p>
                    <p className="card-text mb-0">
                      <strong>Register:</strong> {event.register}
                    </p>
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