import React from 'react';
import { SearchIcon, RefreshIcon, MapPinIcon } from './WeatherIcons';

export function SearchBar({ query, setQuery, onSearch, onLocate, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit} role="search">
      <div className="search-input-wrapper">
        <span className="search-icon-adornment">
          <SearchIcon size={20} />
        </span>
        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder="Search for a city (e.g., Paris, Tokyo, London)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />
        {onLocate && (
          <button
            type="button"
            className="search-locate-btn"
            onClick={onLocate}
            disabled={loading}
            title="Use current location"
            aria-label="Use current location"
          >
            <MapPinIcon size={18} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="search-submit-btn"
        disabled={loading || !query.trim()}
      >
        {loading ? (
          <>
            <RefreshIcon size={18} className="spin" />
            <span>Searching...</span>
          </>
        ) : (
          <span>Get Weather</span>
        )}
      </button>
    </form>
  );
}

