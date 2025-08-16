// src/MatchPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Pitch from './Pitch';
import Substitutions from './Substitutions';

function MatchPage() {
  const { fixtureId } = useParams();
  const [fixture, setFixture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  useEffect(() => {
    const fetchFixtureData = async () => {
      setLoading(true);
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/fixture/${fixtureId}`;
        const response = await axios.get(apiUrl);
        const fixtureData = response.data;
        setFixture(fixtureData);

        // If the match is finished, fetch the AI summary
        if (fixtureData && fixtureData.fixture.status.short === 'FT') {
          fetchSummary(fixtureId);
        }
      } catch (error) {
        console.error('Error fetching fixture data:', error);
      }
      setLoading(false);
    };

    const fetchSummary = async (id) => {
      setIsSummaryLoading(true);
      try {
        const summaryApiUrl = `${process.env.REACT_APP_API_URL}/api/summary/${id}`;
        const response = await axios.get(summaryApiUrl);
        setSummary(response.data.summary);
      } catch (error) {
        console.error('Error fetching summary:', error);
        setSummary('Could not load match summary.');
      }
      setIsSummaryLoading(false);
    };

    fetchFixtureData();
  }, [fixtureId]);

  if (loading) {
    return <div className="loader"></div>;
  }

  if (!fixture) {
    return <h2>Match data not available.</h2>;
  }

  const homeTeam = fixture.teams.home;
  const awayTeam = fixture.teams.away;
  const homeStats = fixture.statistics.find(s => s.team.id === homeTeam.id);
  const awayStats = fixture.statistics.find(s => s.team.id === awayTeam.id);
  
  const homeLineup = fixture.lineups && fixture.lineups[0];
  const awayLineup = fixture.lineups && fixture.lineups[1];

  const getStat = (teamStats, type) => {
    if (!teamStats) return '0';
    const stat = teamStats.statistics.find(s => s.type === type);
    return stat ? stat.value : '0';
  };

  return (
    <div className="match-details">
      <div className="match-header">
        <div className="team-info">
            <img src={homeTeam.logo} alt={homeTeam.name} />
            <h2>{homeTeam.name}</h2>
        </div>
        <div className="score-info">
            <h1>{fixture.goals.home} - {fixture.goals.away}</h1>
            <p>({fixture.fixture.status.long})</p>
        </div>
        <div className="team-info">
            <img src={awayTeam.logo} alt={awayTeam.name} />
            <h2>{awayTeam.name}</h2>
        </div>
      </div>

      {/* --- AI Summary Section --- */}
      {fixture.fixture.status.short === 'FT' && (
        <div className="summary-section">
          <h3>Match Summary</h3>
          {isSummaryLoading ? (
            <p>Generating summary...</p>
          ) : (
            <p className="summary-text">{summary.replace(/\*/g, '')}</p> // Removes markdown like asterisks
          )}
        </div>
      )}
      
      <h3>Match Statistics</h3>
      <div className="stats-comparison">
        <div className="stat-row">
          <span>{getStat(homeStats, 'Total Shots') || 0}</span>
          <p>Total Shots</p>
          <span>{getStat(awayStats, 'Total Shots') || 0}</span>
        </div>
        <div className="stat-row">
          <span>{getStat(homeStats, 'Shots on Goal') || 0}</span>
          <p>Shots on Goal</p>
          <span>{getStat(awayStats, 'Shots on Goal') || 0}</span>
        </div>
        <div className="stat-row">
          <span>{getStat(homeStats, 'Ball Possession') || '0%'}</span>
          <p>Ball Possession</p>
          <span>{getStat(awayStats, 'Ball Possession') || '0%'}</span>
        </div>
      </div>

      {homeLineup && awayLineup ? (
        <>
          <h3>Starting Lineups ({homeLineup.formation} vs {awayLineup.formation})</h3>
          <div className="pitch-lineups-container">
            <Pitch lineup={homeLineup} fixtureId={fixtureId} />
            <Pitch lineup={awayLineup} fixtureId={fixtureId} />
          </div>
          <Substitutions homeSubs={homeLineup.substitutes} awaySubs={awayLineup.substitutes} events={fixture.events} />
        </>
      ) : (
        <h3>Lineups not yet available.</h3>
      )}
    </div>
  );
}

export default MatchPage;
