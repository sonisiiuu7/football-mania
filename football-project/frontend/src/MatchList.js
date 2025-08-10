// src/MatchList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getYesterday = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getYesterday());

  useEffect(() => {
    const fetchMatches = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://football-mania.onrender.com/api/matches/date/${selectedDate}`);
            setMatches(response.data);
        } catch (error) {
            console.error('Error fetching matches:', error);
            setError('Could not load matches. Is the backend server running?');
        }
        setLoading(false);
    };

    fetchMatches();
  }, [selectedDate]);

  const handleDayChange = (offset) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + offset);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  const getMatchStatus = (match) => {
    const status = match.fixture.status;
    if (status.short === 'FT') return <span className="status-completed">Completed</span>;
    if (status.elapsed) return <span className="status-live">{status.elapsed}'</span>;
    return <span className="status-upcoming">{new Date(match.fixture.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>;
  };

  const filteredMatches = matches.filter(match =>
    match.teams.home.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.teams.away.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="matches-list-container">
      <div className="matches-header">
        <h2>Matches</h2>
        <div className="search-and-nav">
          <input
            type="text"
            placeholder="Search by team name..."
            className="search-bar"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="date-navigation">
              <button onClick={() => handleDayChange(-1)} className="nav-button">‹ Prev</button>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="date-picker"/>
              <button onClick={() => handleDayChange(1)} className="nav-button">Next ›</button>
          </div>
        </div>
      </div>
      {loading ? <div className="loader"></div> :
       error ? <p>{error}</p> :
       filteredMatches.length === 0 ? <p>No matches found.</p> :
        filteredMatches.map(match => (
          <Link to={`/match/${match.fixture.id}`} key={match.fixture.id} className="match-card-link">
            <div className="match-card">
              <div className="match-card-header">
                <div className="league-info">
                  <img src={match.league.flag} alt={match.league.country} className="league-flag" onError={(e) => { e.target.onerror = null; e.target.style.display='none' }}/>
                  <span>{match.league.country}: {match.league.name}</span>
                </div>
                <div className="match-status">{getMatchStatus(match)}</div>
              </div>
              <div className="match-card-content">
                <div className="team">
                  <img src={match.teams.home.logo} alt="Home team logo" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/30x30/282c34/ffffff?text=?" }}/>
                  <span>{match.teams.home.name}</span>
                </div>
                <div className="score">{match.goals.home} - {match.goals.away}</div>
                <div className="team away">
                  <span>{match.teams.away.name}</span>
                  <img src={match.teams.away.logo} alt="Away team logo" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/30x30/282c34/ffffff?text=?" }}/>
                </div>
              </div>
            </div>
          </Link>
        ))
      }
    </div>
  );
}

export default MatchList;
