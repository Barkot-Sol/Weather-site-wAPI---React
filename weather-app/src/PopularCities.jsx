import { useState, useEffect } from 'react';

const apiKey = '7c6d0adfdcba86dcedd7b766663a03a5';
const popularCities = ['London', 'New York', 'Buenos Aires', 'Tokyo', 'Addis Ababa', 'Liverpool'];

function PopularCities() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    async function fetchCities() {
      try {
        const promises = popularCities.map(city =>
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
          .then(res => res.json())
        );

        const results = await Promise.all(promises);
        setCities(results);
      } catch(error) {
        console.log('Error:', error);
      }
    }

    fetchCities();
  }, []);

  return (
    <div>
      <h2>Popular Cities</h2>
      {cities.map(data => (
        <div key={data.id}>
          <h3>{data.name} - {data.main.temp}°C</h3>
          <p>{data.main.temp_min}°C (min) / {data.main.temp_max}°C (max)</p>
        </div>
      ))}
    </div>
  );
}

export default PopularCities;