// src/StandingsPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function StandingsPage() {
  const { leagueId } = useParams();
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5001/api/standings/league/${leagueId}`);
        // The API returns an array, we usually want the first element
        setStandings(response.data[0]);
      } catch (error) {
        console.error('Error fetching standings:', error);
      }
      setLoading(false);
    };

    fetchStandings();
  }, [leagueId]);

  if (loading) {
    return <div className="loader"></div>;
  }

  if (!standings || standings.league.standings[0].length === 0) {
    return <h2>Standings not available for this league.</h2>;
  }

  const leagueTable = standings.league.standings[0];

  return (
    <div className="standings-container">
      <div className="standings-header">
        <img src={standings.league.logo} alt={standings.league.name} />
        <h2>{standings.league.name} Standings</h2>
      </div>
      <table className="standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th className="team-name-col">Team</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>G</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {leagueTable.map(team => (
            <tr key={team.team.id}>
              <td>{team.rank}</td>
              <td className="team-name-col">
                <img src={team.team.logo} alt={team.team.name} className="team-logo-small" />
                {team.team.name}
              </td>
              <td>{team.all.played}</td>
              <td>{team.all.win}</td>
              <td>{team.all.draw}</td>
              <td>{team.all.lose}</td>
              <td>{team.all.goals.for}:{team.all.goals.against}</td>
              <td><strong>{team.points}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StandingsPage;