// football-project/backend/server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());

// --- Helper Function to format events for the AI prompt ---
const formatMatchEventsForAI = (fixtureData) => {
  const { teams, events, goals } = fixtureData;
  const homeTeam = teams.home.name;
  const awayTeam = teams.away.name;
  const score = `${goals.home}-${goals.away}`;

  let eventSummary = `Final Score: ${homeTeam} ${score} ${awayTeam}.\n`;

  events.forEach(event => {
    if (event.type === 'Goal') {
      eventSummary += `- Goal at ${event.time.elapsed}' by ${event.player.name} (${event.team.name}).\n`;
    }
    if (event.type === 'Card') {
      eventSummary += `- ${event.detail} at ${event.time.elapsed}' for ${event.player.name} (${event.team.name}).\n`;
    }
  });
  return eventSummary;
};


// --- API Endpoints ---

// Generic error handler
const createErrorHandler = (apiName) => (error, res) => {
  console.error(`Error fetching from ${apiName}:`, error.message);
  if (error.response) {
    console.error('API Response Status:', error.response.status);
    console.error('API Response Data:', error.response.data);
    if (error.response.status >= 400) {
      return res.status(error.response.status).json({ message: `Failed to fetch data from the provider. Status: ${error.response.status}` });
    }
  }
  res.status(500).json({ message: `Failed to fetch ${apiName}.` });
};

// --- NEW AI SUMMARY ENDPOINT ---
app.get('/api/summary/:fixtureId', async (req, res) => {
  const { fixtureId } = req.params;
  try {
    // 1. Fetch fixture data first
    const fixtureResponse = await axios.get('https://v3.football.api-sports.io/fixtures', {
      params: { id: fixtureId },
      headers: { 'x-rapidapi-key': process.env.API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' }
    });
    
    const fixtureData = fixtureResponse.data.response[0];
    if (!fixtureData) {
      return res.status(404).json({ message: 'Fixture not found.' });
    }
    
    // 2. Format the data and create a prompt for the AI
    const eventDetails = formatMatchEventsForAI(fixtureData);
    const prompt = `Generate a 2-paragraph, news-style summary for a football match with the following key events:\n${eventDetails}`;

    // 3. Call the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Send the summary back to the client
    res.json({ summary: text });

  } catch (error) {
    createErrorHandler('AI summary')(error, res);
  }
});


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

// Get a list of major leagues
app.get('/api/leagues', async (req, res) => {
    try {
        const response = await axios.get('https://v3.football.api-sports.io/leagues', {
            params: { current: 'true' },
            headers: { 'x-rapidapi-key': process.env.API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' }
        });
        res.json(response.data.response);
    } catch (error) {
        createErrorHandler('leagues')(error, res);
    }
});

// Get standings for a specific league
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




