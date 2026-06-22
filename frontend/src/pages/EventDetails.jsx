import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getById(id);
        setEvent(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      await eventService.register(id);
      setRegistered(true);
      alert('Successfully registered!');
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="spinner">Loading event details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event) return <div className="error-message">Event not found</div>;

  return (
    <div className="event-details-container">
      <div className="event-details-card">
        <h1>{event.title}</h1>
        <div className="event-meta">
          <span>📅 {new Date(event.date).toLocaleDateString()}</span>
          <span>📍 {event.location}</span>
          <span>👥 Capacity: {event.capacity}</span>
        </div>
        <p className="event-description">{event.description}</p>
        <div className="event-actions">
          {registered ? (
            <Button disabled text="Registered" variant="secondary" />
          ) : (
            <Button
              onClick={handleRegister}
              disabled={registering}
              text={registering ? 'Registering...' : 'Register Now'}
              variant="primary"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
