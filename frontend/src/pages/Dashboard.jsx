import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import EventCard from '../components/EventCard';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAll();
        setEvents(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Discover Events</h1>
        <p>Explore upcoming events and check in with ease.</p>
      </header>

      {loading && <div className="spinner">Loading events...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="events-grid">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event._id} event={event} />)
          ) : (
            <p className="no-events">No events found. Stay tuned!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
