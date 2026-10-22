import React from 'react';
import {
  getWeatherConditionIcon,
  DropletIcon,
  WindIcon,
  CalendarIcon,
  ThermometerIcon
} from './WeatherIcons';

export function WeeklyForecastTable({ weeklyData = [], unit = 'metric' }) {
  if (!weeklyData || weeklyData.length === 0) {
    return null;
  }

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

  // Find global min and max across all 7 days to calibrate the temperature bars
  const allMin = Math.min(...weeklyData.map((d) => d.temp_min));
  const allMax = Math.max(...weeklyData.map((d) => d.temp_max));
  const globalRange = allMax === allMin ? 1 : allMax - allMin;

  return (
    <section className="weekly-forecast-card" aria-label="Next Week Weather Forecast Table">
      <div className="forecast-card-header">
        <div className="forecast-header-title">
          <div className="forecast-header-badge">
            <CalendarIcon size={14} />
            7-Day Outlook
          </div>
          <h2 className="forecast-title">Next Week's Forecast</h2>
        </div>
        <div className="forecast-subtitle">
          Weekly weather breakdown & temperature spectrum
        </div>
      </div>

      <div className="weekly-table-responsive-wrapper">
        <table className="weekly-weather-table" role="table">
          <thead>
            <tr>
              <th scope="col" className="col-day">Day</th>
              <th scope="col" className="col-condition">Condition</th>
              <th scope="col" className="col-temp-range">Temp Range</th>
              <th scope="col" className="col-feels">Feels Like</th>
              <th scope="col" className="col-rain">Precipitation</th>
              <th scope="col" className="col-humidity">Humidity</th>
              <th scope="col" className="col-wind">Wind</th>
            </tr>
          </thead>
          <tbody>
            {weeklyData.map((dayItem, index) => {
              // Calculate relative positions for the temperature bar
              const leftPercent = Math.max(0, Math.min(100, ((dayItem.temp_min - allMin) / globalRange) * 100));
              const widthPercent = Math.max(12, Math.min(100 - leftPercent, ((dayItem.temp_max - dayItem.temp_min) / globalRange) * 100));

              const isToday = index === 0 || dayItem.day.toLowerCase() === 'today';

              return (
                <tr
                  key={`day-${index}`}
                  className={`weekly-table-row ${isToday ? 'current-day-row' : ''}`}
                >
                  {/* Day & Date */}
                  <td className="col-day">
                    <div className="day-name-wrapper">
                      <span className="day-name-text">
                        {dayItem.day}
                        {isToday && <span className="today-badge">NOW</span>}
                      </span>
                      <span className="day-date-sub">{dayItem.date}</span>
                    </div>
                  </td>

                  {/* Condition with Icon */}
                  <td className="col-condition">
                    <div className="condition-cell-wrapper">
                      <span className="condition-icon-badge">
                        {getWeatherConditionIcon(dayItem.mainCondition || dayItem.description, 20)}
                      </span>
                      <span className="condition-text">{dayItem.description}</span>
                    </div>
                  </td>

                  {/* Temperature Spectrum Bar */}
                  <td className="col-temp-range">
                    <div className="temp-range-wrapper">
                      <span className="temp-bound min-bound">{toDisplayTemp(dayItem.temp_min)}</span>
                      <div className="temp-bar-track">
                        <div
                          className="temp-bar-fill"
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`
                          }}
                          title={`Low: ${toDisplayTemp(dayItem.temp_min)} • High: ${toDisplayTemp(dayItem.temp_max)}`}
                        />
                      </div>
                      <span className="temp-bound max-bound">{toDisplayTemp(dayItem.temp_max)}</span>
                    </div>
                  </td>

                  {/* Feels Like */}
                  <td className="col-feels">
                    <div className="metric-cell-pill">
                      <ThermometerIcon size={14} />
                      <span>{toDisplayTemp(dayItem.feels_like)}</span>
                    </div>
                  </td>

                  {/* Precipitation / Rain Chance */}
                  <td className="col-rain">
                    <div className={`rain-chance-pill ${dayItem.pop > 40 ? 'high-rain' : ''}`}>
                      <DropletIcon size={12} />
                      <span>{dayItem.pop}%</span>
                    </div>
                  </td>

                  {/* Humidity */}
                  <td className="col-humidity">
                    <span className="humidity-text">{dayItem.humidity}%</span>
                  </td>

                  {/* Wind */}
                  <td className="col-wind">
                    <div className="wind-cell-wrapper">
                      <WindIcon size={13} />
                      <span>{toDisplayWind(dayItem.windSpeed)}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
