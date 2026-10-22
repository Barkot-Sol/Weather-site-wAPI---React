import React from 'react';
import {
  MapPinIcon,
  WindIcon,
  DropletIcon,
  GaugeIcon,
  ThermometerIcon,
  getWeatherConditionIcon
} from './WeatherIcons';

export function WeatherCard({ weather, unit }) {
  if (!weather) return null;

  const toDisplayTemp = (celsius) => {
    if (unit === 'imperial') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  const toDisplayWind = (speedMs) => {
    if (unit === 'imperial') {
      return `${(speedMs * 2.237).toFixed(1)} mph`;
    }
    return `${speedMs} m/s`;
  };

  return (
    <article className="weather-result-card" aria-label={`Current weather for ${weather.name}`}>
      <div className="weather-main-row">
        <div className="weather-city-info">
          <div className="weather-city-title">
            <MapPinIcon size={30} style={{ color: '#c084fc' }} />
            <span>{weather.name}</span>
            {weather.country && <span className="country-chip">{weather.country}</span>}
          </div>

          <div className="weather-condition-pill">
            {getWeatherConditionIcon(weather.mainCondition || weather.description, 26)}
            <span>{weather.description}</span>
          </div>
        </div>

        <div className="weather-temp-block">
          <div className="current-temp">{toDisplayTemp(weather.temp)}</div>
          <div className="temp-min-max">
            <span>Low: <strong>{toDisplayTemp(weather.temp_min)}</strong></span>
            {' • '}
            <span>High: <strong>{toDisplayTemp(weather.temp_max)}</strong></span>
          </div>
        </div>
      </div>

      <div className="weather-metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box">
            <ThermometerIcon size={20} />
          </div>
          <div>
            <div className="metric-label">Feels Like</div>
            <div className="metric-value">{toDisplayTemp(weather.feels_like)}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box">
            <DropletIcon size={20} />
          </div>
          <div>
            <div className="metric-label">Humidity</div>
            <div className="metric-value">{weather.humidity}%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box">
            <WindIcon size={20} />
          </div>
          <div>
            <div className="metric-label">Wind Speed</div>
            <div className="metric-value">{toDisplayWind(weather.windSpeed)}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box">
            <GaugeIcon size={20} />
          </div>
          <div>
            <div className="metric-label">Pressure</div>
            <div className="metric-value">{weather.pressure} hPa</div>
          </div>
        </div>
      </div>
    </article>
  );
}
