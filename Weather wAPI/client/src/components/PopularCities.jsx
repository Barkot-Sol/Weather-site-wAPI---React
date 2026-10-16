import React from 'react';
import { RefreshIcon, getWeatherConditionIcon } from './WeatherIcons';

export function PopularCities({
  cities,
  loading,
  selectedCityName,
  onSelectCity,
  onRefresh,
  unit
}) {
  const toDisplayTemp = (celsius) => {
    if (unit === 'imperial') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  return (
    <section className="popular-section" aria-labelledby="popular-cities-title">
      <div className="popular-header">
        <div className="popular-title-wrapper">
          <h2 id="popular-cities-title" className="popular-title">
            Popular Cities
          </h2>
          <p className="popular-subtitle">
            Click any city card to inspect live weather
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={onRefresh}
          title="Refresh popular cities"
          disabled={loading}
          aria-label="Refresh popular cities list"
        >
          <RefreshIcon size={18} className={loading ? 'spin' : ''} />
        </button>
      </div>

      <div className="popular-grid">
        {loading && (!cities || cities.length === 0) ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))
        ) : (
          cities.map((city) => {
            const isSelected = selectedCityName && selectedCityName.toLowerCase() === city.name.toLowerCase();
            return (
              <div
                key={city.name}
                className={`popular-card ${isSelected ? 'active-selected' : ''}`}
                onClick={() => onSelectCity(city.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectCity(city.name);
                  }
                }}
              >
                <div className="city-main">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <h3>{city.name}</h3>
                    {city.country && <span className="country-chip">{city.country}</span>}
                  </div>
                  <div className="city-condition" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {getWeatherConditionIcon(city.mainCondition || city.description, 16)}
                    <span>{city.description}</span>
                  </div>
                </div>

                <div className="city-temp-side">
                  <div className="city-temp">{toDisplayTemp(city.temp)}</div>
                  <div className="city-minmax">
                    {toDisplayTemp(city.temp_min)} / {toDisplayTemp(city.temp_max)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
