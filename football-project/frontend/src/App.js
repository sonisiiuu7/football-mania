// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import './App.css';
import MatchList from './MatchList';
import MatchPage from './MatchPage';
import PlayerPage from './PlayerPage';
import LeaguesPage from './LeaguesPage';
import StandingsPage from './StandingsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <NavLink to="/" className="header-link"><h1>FOOTBALL MANIA</h1></NavLink>
          <nav className="main-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Matches</NavLink>
            <NavLink to="/leagues" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Leagues</NavLink>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<MatchList />} />
            <Route path="/leagues" element={<LeaguesPage />} />
            <Route path="/standings/:leagueId" element={<StandingsPage />} />
            <Route path="/match/:fixtureId" element={<MatchPage />} />
            <Route path="/player/:playerId/fixture/:fixtureId" element={<PlayerPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
    

