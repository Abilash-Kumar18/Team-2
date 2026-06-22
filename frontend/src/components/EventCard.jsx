import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const EventCard = ({ event }) => {
  const { _id, title, description, date, location } = event;

  return (
    <div className="event-card">
      <div className="event-card-body">
        <h3 className="event-card-title">{title}</h3>
        <p className="event-card-date">📅 {new Date(date).toLocaleDateString()}</p>
        <p className="event-card-location">📍 {location}</p>
        <p className="event-card-description">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
        <div className="event-card-footer">
          <Link to={`/events/${_id}`}>
            <Button text="View Details" variant="outline" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
