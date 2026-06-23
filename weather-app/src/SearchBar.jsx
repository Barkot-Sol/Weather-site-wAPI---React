import { useState } from 'react';

function SearchBar() {
  const [city, setCity] = useState('');

  function handleSearch() {
    console.log(city);
  }

  return (
    <div>
      <input 
        type="text" 
        placeholder="Enter a city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;