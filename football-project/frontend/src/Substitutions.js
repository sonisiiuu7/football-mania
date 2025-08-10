// src/Substitutions.js
import React from 'react';
import './App.css';

function Substitutions({ homeSubs, awaySubs, events }) {
  // Filter for substitution events only
  const substitutionEvents = events.filter(event => event.type === 'subst');

  return (
    <div className="substitutions-section">
      <h3>Substitutions & Bench</h3>
      <div className="substitutions-container">
        {/* Bench Section */}
        <div className="bench-list">
          <h4>Bench</h4>
          <div className="bench-columns">
            <ul>
              {homeSubs.map(sub => (
                <li key={sub.player.id}>{sub.player.name}</li>
              ))}
            </ul>
            <ul>
              {awaySubs.map(sub => (
                <li key={sub.player.id}>{sub.player.name}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* Events Section */}
        <div className="events-list">
          <h4>Events</h4>
          {substitutionEvents.length > 0 ? (
            <ul>
              {substitutionEvents.map((event, index) => (
                <li key={index} className="event-item">
                  <span className="event-minute">{event.time.elapsed}'</span>
                  <div className="event-details">
                    <span className="player-in">↑ {event.player.name}</span>
                    <span className="player-out">↓ {event.assist.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No substitutions in this match.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Substitutions;