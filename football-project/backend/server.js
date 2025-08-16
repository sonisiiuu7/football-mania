const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

// --- API Endpoints ---

// Generic error handler for more detailed logging
const createErrorHandler = (apiName) => (error, res) => {
  console.error(`Error fetching from ${apiName}:`, error.message);
  if (error.response) {
    console.error('API Response Status:', error.response.status);
    console.error('API Response Data:', error.response.data);
    // Forward the status code if it's a client-side or server-side error from the API
    if (error.response.status >= 400) {
      return res.status(error.response.status).json({ message: `Failed to fetch data from the provider. Status: ${error.response.status}` });
    }
  }
  res.status(500).json({ message: `Failed to fetch ${apiName}.` });
};

// Get matches for a specific date
app.get('/api/matches/date/:date', async (req, res) => {
    const { date } = req.params;
    try {
        const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
            params: { date: date },
            headers: { 'x-rapidapi-key': process.env.API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' }
        });
        res.json(response.data.response);
    } catch (error) {
        createErrorHandler('matches for date')(error, res);
    }
});

// Get all data for a single fixture
app.get('/api/fixture/:fixtureId', async (req, res) => {
    const { fixtureId } = req.params;
    try {
        const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
            params: { id: fixtureId },
            headers: { 'x-rapidapi-key': process.env.API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' }
        });
        res.json(response.data.response[0]);
    } catch (error) {
        createErrorHandler('fixture data')(error, res);
    }
});

// Get data for a single player in a single fixture
app.get('/api/player/:playerId/fixture/:fixtureId', async (req, res) => {
  const { playerId, fixtureId } = req.params;
  try {
    const response = await axios.get('https://v3.football.api-sports.io/fixtures/players', {
      params: { fixture: fixtureId, player: playerId },
      headers: { 'x-rapidapi-key': process.env.API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' }
    });
    res.json(response.data.response[0]);
  } catch (error) {
    createErrorHandler('single player data')(error, res);
  }
});

// NEW: Get a list of major leagues
app.get('/api/leagues', async (req, res) => {
    try {
        const response = await axios.get('https://v3.football.api-sports.io/leagues', {
            // We can specify which leagues we want, for example
            params: { current: 'true' }, // Get current leagues
            headers: { 'x-rapidapi-key': process.env.API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' }
        });
        res.json(response.data.response);
    } catch (error) {
        createErrorHandler('leagues')(error, res);
    }
});

// NEW: Get standings for a specific league
app.get('/api/standings/league/:leagueId', async (req, res) => {
    const { leagueId } = req.params;
    const currentYear = new Date().getFullYear();
    try {
        const response = await axios.get('https://v3.football.api-sports.io/standings', {
            params: { league: leagueId, season: currentYear },
            headers: { 'x-rapidapi-key': process.env.API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' }
        });
        res.json(response.data.response);
    } catch (error) {
        createErrorHandler('standings')(error, res);
    }
});


// Start the server!
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});




