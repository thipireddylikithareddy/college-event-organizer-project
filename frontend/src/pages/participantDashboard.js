import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ParticipantDashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events/all');
        const allEvents = response.data.events;

        const now = new Date();

        const upcoming = [];
        const completed = [];

        allEvents.forEach(event => {
          const eventDateTime = new Date(`${event.date}T${event.time}`);
          if (eventDateTime >= now) {
            upcoming.push(event);
          } else {
            completed.push(event);
          }
        });

        upcoming.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
        completed.sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

        setUpcomingEvents(upcoming);
        setCompletedEvents(completed);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleLogout = () => {
    localStorage.clear();

    navigate('/login');
  };

  useEffect(() => {
    let lastPopStateUrl = window.location.href;
    const handlePopState = (event) => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastPopStateUrl) {
        const historyState = event.state;
        if (historyState === null || historyState?.idx < window.history.state?.idx) {
          localStorage.clear();
          navigate('/login');
        }
        lastPopStateUrl = currentUrl;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

 return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Participant Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      {/* Upcoming Events Section */}
      <h3 className="mb-3 text-success">Upcoming Events</h3>
      <div className="row">
        {upcomingEvents.length === 0 ? (
          <p>No upcoming events available.</p>
        ) : (
          upcomingEvents.map(event => (
            <div className="col-md-6 col-lg-4 mb-3" key={event._id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{event.eventName}</h5>
                  <p className="card-text">{event.description}</p>
                  <p className="card-text">
                    <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="card-text">
                    <strong>Time:</strong> {event.time}
                  </p>
                  <p className="card-text">
                    <strong>Venue:</strong> {event.venue}
                  </p>
                  <p className="card-text">
                    <strong>Organizer:</strong> {event.organizer?.name || 'Unknown'}
                  </p>
                  <p className="card-text">
                    <strong>Registration Link:</strong> <a href={event.register}>Registration Link</a>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed Events Section */}
      <h3 className="mt-5 mb-3 text-secondary">Completed Events</h3>
      <div className="row">
        {completedEvents.length === 0 ? (
          <p>No completed events yet.</p>
        ) : (
          completedEvents.map(event => (
            <div className="col-md-6 col-lg-4 mb-3" key={event._id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{event.eventName}</h5>
                  <p className="card-text">{event.description}</p>
                  <p className="card-text">
                    <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="card-text">
                    <strong>Time:</strong> {event.time}
                  </p>
                  <p className="card-text">
                    <strong>Venue:</strong> {event.venue}
                  </p>
                  <p className="card-text">
                    <strong>Organizer:</strong> {event.organizer?.name || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ParticipantDashboard;