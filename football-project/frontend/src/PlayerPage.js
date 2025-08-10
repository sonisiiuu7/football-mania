    // src/PlayerPage.js
    import React, { useState, useEffect } from 'react';
    import { useParams } from 'react-router-dom';
    import axios from 'axios';
    import Heatmap from './Heatmap';

    function PlayerPage() {
      const { playerId, fixtureId } = useParams();
      const [player, setPlayer] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        axios.get(`http://localhost:5001/api/player/${playerId}/fixture/${fixtureId}`)
          .then(response => {
            setPlayer(response.data);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching player data:', error);
            setLoading(false);
          });
      }, [playerId, fixtureId]);

      if (loading) {
        return <div className="loader"></div>;
      }

      if (!player) {
        return <h2>Player not found.</h2>;
      }

      const stats = player.statistics[0];

      return (
        <div className="player-details-page">
          <div className="player-header">
            <img src={player.player.photo} alt={player.player.name} className="player-photo" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x150/1d3557/ffffff?text=?" }}/>
            <div className="player-info">
                <h2>{player.player.name}</h2>
                <p><strong>Team:</strong> {stats.team.name}</p>
                <p><strong>Position:</strong> {stats.games.position}</p>
                <p><strong>Rating:</strong> {stats.games.rating || 'N/A'}</p>
            </div>
          </div>
          
          <h3>Average Position Heatmap</h3>
          <Heatmap players={[player]} />

          <h3>Match Statistics</h3>
          <div className="stats-category">
            <h4>Attacking</h4>
            <div className="player-stats-grid">
                <p><strong>Goals:</strong> {stats.goals.total || 0}</p>
                <p><strong>Assists:</strong> {stats.goals.assists || 0}</p>
                <p><strong>Total Shots:</strong> {stats.shots.total || 0}</p>
                <p><strong>Shots on Goal:</strong> {stats.shots.on || 0}</p>
            </div>
          </div>
          <div className="stats-category">
            <h4>Defending</h4>
            <div className="player-stats-grid">
                <p><strong>Tackles:</strong> {stats.tackles.total || 0}</p>
                <p><strong>Blocks:</strong> {stats.tackles.blocks || 0}</p>
                <p><strong>Interceptions:</strong> {stats.tackles.interceptions || 0}</p>
            </div>
          </div>
          <div className="stats-category">
            <h4>Duels</h4>
            <div className="player-stats-grid">
                <p><strong>Total Duels:</strong> {stats.duels.total || 0}</p>
                <p><strong>Duels Won:</strong> {stats.duels.won || 0}</p>
            </div>
          </div>
           <div className="stats-category">
            <h4>Dribbling</h4>
            <div className="player-stats-grid">
                <p><strong>Attempts:</strong> {stats.dribbles.attempts || 0}</p>
                <p><strong>Successful:</strong> {stats.dribbles.success || 0}</p>
            </div>
          </div>
          <div className="stats-category">
            <h4>Passing</h4>
            <div className="player-stats-grid">
                <p><strong>Total Passes:</strong> {stats.passes.total || 0}</p>
                <p><strong>Key Passes:</strong> {stats.passes.key || 0}</p>
                <p><strong>Pass Accuracy:</strong> {stats.passes.accuracy}%</p>
            </div>
          </div>
        </div>
      );
    }

    export default PlayerPage;
