import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Pitch = ({ lineup, fixtureId }) => {
  if (!lineup || !lineup.startXI) {
    return <p>Lineup information not available.</p>;
  }

  // Separate players by their position (Goalkeeper, Defender, Midfielder, Forward)
  const goalkeeper = lineup.startXI.filter(p => p.player.pos === 'G');
  const defenders = lineup.startXI.filter(p => p.player.pos === 'D');
  const midfielders = lineup.startXI.filter(p => p.player.pos === 'M');
  const forwards = lineup.startXI.filter(p => p.player.pos === 'F');

  // A helper function to render a single player marker
  const renderPlayerMarker = (player) => (
    <Link
      to={`/player/${player.id}/fixture/${fixtureId}`}
      key={player.id}
      className="player-marker"
    >
      <div className="player-shirt" style={{ backgroundColor: `#${lineup.team.colors.player.primary}`, color: `#${lineup.team.colors.player.number}` }}>
        <span className="player-number-on-pitch">{player.number}</span>
      </div>
      <span className="player-name-on-pitch">{player.name.split(' ').pop()}</span>
    </Link>
  );

  return (
    // This container now has the pitch as a background image via CSS
    <div className="pitch-container">
        {/* Render each line of players directly inside the container */}
        <div className="pitch-row goalkeeper-row">
          {goalkeeper.map(p => renderPlayerMarker(p.player))}
        </div>
        <div className="pitch-row defender-row">
          {defenders.map(p => renderPlayerMarker(p.player))}
        </div>
        <div className="pitch-row midfielder-row">
          {midfielders.map(p => renderPlayerMarker(p.player))}
        </div>
        <div className="pitch-row forward-row">
          {forwards.map(p => renderPlayerMarker(p.player))}
        </div>
    </div>
  );
};

export default Pitch;
