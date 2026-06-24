function WeatherDisplay({ weather }) {
  return (
    <div>
      <h2>{weather.name}</h2>
      <p>{weather.main.temp}°C</p>
      <p>{weather.main.temp_min}°C (min) / {weather.main.temp_max}°C (max)</p>
      <p>{weather.weather[0].description}</p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
}

export default WeatherDisplay;