// src/LeaguesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function LeaguesPage() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagues = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://football-mania.onrender.com/api/leagues');
        // FIX: Removed the filter to display all leagues available on the free plan
        setLeagues(response.data);
      } catch (error) {
        console.error('Error fetching leagues:', error);
      }
      setLoading(false);
    };

    fetchLeagues();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="leagues-container">
      <h2>Leagues</h2>
      {leagues.length > 0 ? (
        <div className="leagues-grid">
          {leagues.map(item => (
            <Link to={`/standings/${item.league.id}`} key={item.league.id} className="league-card">
              <img src={item.league.logo} alt={item.league.name} className="league-logo" />
              <h3>{item.league.name}</h3>
              <p>{item.country.name}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p>No leagues could be fetched. This may be due to the API's daily request limit.</p>
      )}
    </div>
  );
}

export default LeaguesPage;
