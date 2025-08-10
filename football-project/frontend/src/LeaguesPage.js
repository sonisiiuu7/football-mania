// src/LeaguesPage.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function LeaguesPage() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  // A curated list of popular league IDs for a better user experience
  // FIX: useMemo will prevent this array from being recreated on every render
  const popularLeagueIds = useMemo(() => [39, 140, 135, 78, 61, 2, 3], []); // Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Europa League

  useEffect(() => {
    const fetchLeagues = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/leagues');
        // Filter the leagues to show only the popular ones
        const popularLeagues = response.data.filter(item => popularLeagueIds.includes(item.league.id));
        setLeagues(popularLeagues);
      } catch (error) {
        console.error('Error fetching leagues:', error);
      }
      setLoading(false);
    };

    fetchLeagues();
  }, [popularLeagueIds]); // FIX: Added popularLeagueIds to the dependency array

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="leagues-container">
      <h2>Leagues</h2>
      <div className="leagues-grid">
        {leagues.map(item => (
          <Link to={`/standings/${item.league.id}`} key={item.league.id} className="league-card">
            <img src={item.league.logo} alt={item.league.name} className="league-logo" />
            <h3>{item.league.name}</h3>
            <p>{item.country.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LeaguesPage;
