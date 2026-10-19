import React, { useState, useEffect, useCallback } from 'react';
import { DateDisplay } from './components/DateDisplay';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { HourlyForecastGraph } from './components/HourlyForecastGraph';
import { WeeklyForecastTable } from './components/WeeklyForecastTable';
import { PopularCities } from './components/PopularCities';

export default function App() {
  const [query, setQuery] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [popularCities, setPopularCities] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' (°C) or 'imperial' (°F)
  const [bgImage, setBgImage] = useState('default.jpg');

  // Fetch weather for a given city
  const fetchWeather = useCallback(async (city) => {
    if (!city || !city.trim()) return;
    setLoadingWeather(true);
    setError(null);

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data.');
      }

      setCurrentWeather(data);
      if (data.bg) {
        setBgImage(data.bg);
      }
    } catch (err) {
      console.error('Weather search error:', err);
      setError(err.message || 'Unable to retrieve weather. Please try again.');
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  // Fetch weather by geographic coordinates
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoadingWeather(true);
    setError(null);

    try {
      const response = await fetch(`/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data for your location.');
      }

      setCurrentWeather(data);
      if (data.name) {
        setQuery(data.name);
      }
      if (data.bg) {
        setBgImage(data.bg);
      }
    } catch (err) {
      console.warn('Coordinates weather error, falling back to default:', err);
      fetchWeather('London');
    } finally {
      setLoadingWeather(false);
    }
  }, [fetchWeather]);

  // Trigger geolocation detection
  const handleDetectLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingWeather(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (geoError) => {
        console.warn('Geolocation error or permission denied:', geoError.message);
        // If initial or manual, fallback gracefully to London
        fetchWeather('London');
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, [fetchWeatherByCoords, fetchWeather]);

  // Fetch popular cities on load or manual refresh
  const fetchPopular = useCallback(async () => {
    setLoadingPopular(true);
    try {
      const response = await fetch('/api/popular');
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setPopularCities(data);
      } else {
        console.warn('Could not load popular cities:', data);
      }
    } catch (err) {
      console.error('Error fetching popular cities:', err);
    } finally {
      setLoadingPopular(false);
    }
  }, []);

  // Start the site with the location of the user!
  useEffect(() => {
    fetchPopular();
    handleDetectLocation();
  }, [fetchPopular, handleDetectLocation]);

  const handleCitySelect = (cityName) => {
    setQuery(cityName);
    fetchWeather(cityName);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setCurrentWeather(null);
    setQuery('');
    setBgImage('default.jpg');
    setError(null);
  };

  return (
    <div
      className="app-viewport"
      style={{ backgroundImage: `url('/images/${bgImage}')` }}
    >
      <div className="app-overlay" />

      <main className="app-content">
        {/* Navigation / Header */}
        <header className="app-header">
          <div className="brand-wrapper" onClick={handleReset} title="Reset to Home">
            <div className="brand-icon">
              <img src="/images/Icon.png" alt="Weather icon logo" />
            </div>
            <h1 className="brand-title">Weather Forecast</h1>
          </div>

          <div className="header-controls">
            <DateDisplay />

            <div className="unit-toggle" role="group" aria-label="Temperature unit selector">
              <button
                type="button"
                className={`unit-btn ${unit === 'metric' ? 'active' : ''}`}
                onClick={() => setUnit('metric')}
              >
                °C
              </button>
              <button
                type="button"
                className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`}
                onClick={() => setUnit('imperial')}
              >
                °F
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section with Search and Active Weather */}
        <section className="hero-panel" aria-label="Weather forecast search and current report">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={fetchWeather}
            onLocate={handleDetectLocation}
            loading={loadingWeather}
          />

          {error && (
            <div className="error-banner" role="alert">
              <span>{error}</span>
              <button
                className="error-close-btn"
                onClick={() => setError(null)}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {currentWeather && (
            <>
              <WeatherCard weather={currentWeather} unit={unit} />
              
              {/* 24-Hour Weather Graph */}
              {currentWeather.forecast24h && currentWeather.forecast24h.length > 0 && (
                <HourlyForecastGraph
                  hourlyData={currentWeather.forecast24h}
                  unit={unit}
                />
              )}

              {/* Next Week Weather Table */}
              {currentWeather.forecastWeek && currentWeather.forecastWeek.length > 0 && (
                <WeeklyForecastTable
                  weeklyData={currentWeather.forecastWeek}
                  unit={unit}
                />
              )}
            </>
          )}
        </section>

        {/* Popular Cities Section */}
        <PopularCities
          cities={popularCities}
          loading={loadingPopular}
          selectedCityName={currentWeather ? currentWeather.name : null}
          onSelectCity={handleCitySelect}
          onRefresh={fetchPopular}
          unit={unit}
        />

        <footer className="app-footer">
          <p>
            React Frontend + Node.js Express Backend • Powered by OpenWeatherMap API
          </p>
        </footer>
      </main>
    </div>
  );
}

