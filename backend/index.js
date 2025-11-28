const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://34.228.68.78:8080');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const API_KEY = process.env.MOVIE_API_KEY;
const OMDB_URL = 'http://www.omdbapi.com/';

if (!API_KEY) {
  console.warn('Uwaga: MOVIE_API_KEY nie jest ustawione, backend nie zwróci danych z OMDb');
}

// Prosty endpoint zdrowia (opcjonalnie)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Główny endpoint dla frontendu
// GET /movies?title=Inception
app.get('/movies', async (req, res) => {
  const title = (req.query.title || '').trim();

  if (!title) {
    return res.status(400).json({ Response: 'False', Error: 'Brak tytułu filmu' });
  }

  if (!API_KEY) {
    return res.status(500).json({ Response: 'False', Error: 'Brak klucza API po stronie serwera' });
  }

  try {
    const response = await axios.get(OMDB_URL, {
      params: {
        t: title,
        apikey: API_KEY
      }
    });

    const data = response.data;

    // OMDb zwraca Response: "True"/"False"
    if (data.Response === 'True') {
      // przekazujemy dalej 1:1, frontend nic nie musi zmieniać
      return res.json(data);
    } else {
      return res.status(404).json(data);
    }
  } catch (err) {
    console.error('Błąd zapytania do OMDb:', err.message);
    return res.status(500).json({ Response: 'False', Error: 'Problem z zewnętrznym API' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

