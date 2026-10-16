const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY || '7c6d0adfdcba86dcedd7b766663a03a5';

const popularCities = ['London', 'New York', 'Buenos Aires', 'Tokyo', 'Addis Ababa', 'Liverpool'];

app.use(cors());
app.use(express.json());

// Helper to determine the background image based on weather description
function getBackground(description = '') {
  const desc = description.toLowerCase();
  if (desc.includes('thunderstorm')) return 'thunderstorm.jpg';
  if (desc.includes('drizzle')) return 'drizzle.jpg';
  if (desc.includes('rain')) return 'rain.jpg';
  if (desc.includes('snow')) return 'snow.jpg';
  if (desc.includes('clear')) return 'clear.jpg';
  if (desc.includes('cloud')) return 'cloudy.jpg';
  return 'default.jpg';
}

// Format weather response
function formatWeatherData(data) {
  const weatherItem = (data.weather && data.weather[0]) || {};
  return {
    id: data.id,
    name: data.name,
    country: data.sys ? data.sys.country : '',
    temp: Math.round(data.main.temp),
    temp_min: Math.round(data.main.temp_min),
    temp_max: Math.round(data.main.temp_max),
    feels_like: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind ? data.wind.speed : 0,
    description: weatherItem.description || '',
    mainCondition: weatherItem.main || '',
    icon: weatherItem.icon || '',
    bg: getBackground(weatherItem.description || '')
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Search weather by city
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;

  if (!city || !city.trim()) {
    return res.status(400).json({ error: 'City name query parameter is required.' });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.trim())}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 404) {
      return res.status(404).json({ error: `City "${city}" not found. Please check spelling.` });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Error fetching weather data' });
    }

    const formatted = formatWeatherData(data);
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching weather for', city, error);
    res.status(500).json({ error: 'Internal server error while fetching weather.' });
  }
});

// Get weather for popular cities
app.get('/api/popular', async (req, res) => {
  try {
    const promises = popularCities.map(async (city) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch for ${city}: ${response.statusText}`);
      }
      const data = await response.json();
      return formatWeatherData(data);
    });

    const results = await Promise.allSettled(promises);
    const successfulData = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value);

    res.json(successfulData);
  } catch (error) {
    console.error('Error fetching popular cities:', error);
    res.status(500).json({ error: 'Failed to fetch popular cities weather.' });
  }
});

app.listen(PORT, () => {
  console.log(`Weather backend server is running on http://localhost:${PORT}`);
});
