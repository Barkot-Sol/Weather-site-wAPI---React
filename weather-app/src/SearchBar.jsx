import { useState } from 'react';
import WeatherDisplay from './WeatherDisplay';

const apiKey = '7c6d0adfdcba86dcedd7b766663a03a5';

function SearchBar() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  async function handleSearch() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setWeather(data);
    } catch(error) {
      console.log('Error:', error);
    }
  }

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <input 
          type="text" 
          placeholder="Enter a city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {weather && <WeatherDisplay weather={weather} />}
    </div>
  );
}

export default SearchBar;