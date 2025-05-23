import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ParticipantDashboard() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all events on component mount
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events/all');
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleLogout = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem('token');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">All Events</h2>
      {events.length === 0 ? (
        <p>No events available at the moment.</p>
      ) : (
        <div className="row">
          {events.map(event => (
            <div className="col-md-6 col-lg-4 mb-3" key={event._id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{event.eventName}</h5>
                  <p className="card-text"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p className="card-text"><strong>Time:</strong> {event.time}</p>
                  <p className="card-text d-flex align-items-center flex-wrap">
                    <strong className="me-1">Venue:</strong> {event.venue}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ms-2 badge bg-primary text-decoration-none"
                      style={{ fontSize: '0.75rem' }}
                    >
                      Get Directions
                    </a>
                  </p>
                  <p className="card-text">
                    <strong>Organizer:</strong> {event.organizer?.name || 'Unknown'}
                  </p>
                  <p className="card-text"><strong>Registration Link:</strong> <a href= {event.register}> register </a> </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
}

export default ParticipantDashboard;









