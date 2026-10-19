import React, { useState, useMemo } from 'react';
import { getWeatherConditionIcon, DropletIcon, WindIcon } from './WeatherIcons';

export function HourlyForecastGraph({ hourlyData = [], unit = 'metric' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [metricMode, setMetricMode] = useState('temp'); // 'temp' | 'pop' | 'wind'

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

  // Guard against empty array
  if (!hourlyData || hourlyData.length === 0) {
    return null;
  }

  // Calculate coordinates and scales for SVG
  const width = 800;
  const height = 220;
  const paddingX = 45;
  const paddingTop = 45;
  const paddingBottom = 45;

  const pointsCount = hourlyData.length;
  const stepX = (width - paddingX * 2) / Math.max(1, pointsCount - 1);

  // Extract values based on metricMode
  const values = hourlyData.map((d) => {
    if (metricMode === 'pop') return d.pop || 0;
    if (metricMode === 'wind') return unit === 'imperial' ? d.windSpeed * 2.237 : d.windSpeed;
    return unit === 'imperial' ? Math.round((d.temp * 9) / 5 + 32) : d.temp;
  });

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal === minVal ? 1 : maxVal - minVal;

  // Generate (x, y) coordinates for each point
  const coords = values.map((val, i) => {
    const x = paddingX + i * stepX;
    const normalized = (val - minVal) / range;
    const y = height - paddingBottom - normalized * (height - paddingTop - paddingBottom);
    return { x, y, data: hourlyData[i], val };
  });

  // Construct smooth cubic bezier SVG path
  const pathD = useMemo(() => {
    if (coords.length === 0) return '';
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }
    return d;
  }, [coords]);

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - paddingBottom} L ${coords[0].x} ${height - paddingBottom} Z`;

  // 24h Summary statistics
  const temps = hourlyData.map((d) => d.temp);
  const minTemp24h = Math.min(...temps);
  const maxTemp24h = Math.max(...temps);
  const maxRainPop = Math.max(...hourlyData.map((d) => d.pop || 0));

  const activePoint = hoveredIndex !== null ? coords[hoveredIndex] : null;

  return (
    <section className="hourly-forecast-card" aria-label="24-Hour Weather Forecast Graph">
      <div className="forecast-card-header">
        <div className="forecast-header-title">
          <div className="forecast-header-badge">
            <span className="live-pulse" />
            24-Hour Timeline
          </div>
          <h2 className="forecast-title">24-Hour Weather Trend</h2>
        </div>

        <div className="forecast-header-actions">
          <div className="metric-toggle-group" role="group" aria-label="Forecast display metric">
            <button
              type="button"
              className={`metric-toggle-btn ${metricMode === 'temp' ? 'active' : ''}`}
              onClick={() => setMetricMode('temp')}
            >
              Temperature
            </button>
            <button
              type="button"
              className={`metric-toggle-btn ${metricMode === 'pop' ? 'active' : ''}`}
              onClick={() => setMetricMode('pop')}
            >
              Rain Chance
            </button>
            <button
              type="button"
              className={`metric-toggle-btn ${metricMode === 'wind' ? 'active' : ''}`}
              onClick={() => setMetricMode('wind')}
            >
              Wind
            </button>
          </div>

          <div className="forecast-summary-stats">
            <span>24h Range: <strong>{toDisplayTemp(minTemp24h)} - {toDisplayTemp(maxTemp24h)}</strong></span>
            {maxRainPop > 0 && <span> • Max Rain: <strong>{maxRainPop}%</strong></span>}
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="graph-svg-wrapper">
        <svg
          className="hourly-svg-chart"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
              <stop offset="70%" stopColor="#94a3b8" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal grid lines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={width - paddingX}
            y2={paddingTop}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={(paddingTop + height - paddingBottom) / 2}
            x2={width - paddingX}
            y2={(paddingTop + height - paddingBottom) / 2}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingBottom}
            x2={width - paddingX}
            y2={height - paddingBottom}
            stroke="rgba(255, 255, 255, 0.15)"
          />

          {/* Area Fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Curved Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Hover guideline */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={paddingTop - 10}
              x2={activePoint.x}
              y2={height - paddingBottom}
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}

          {/* Data Points on Line */}
          {coords.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={`pt-${i}`} className="graph-node-group">
                {/* Node Outer Ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : 4}
                  fill="#1b122c"
                  stroke={isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.75)'}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  style={{ transition: 'all 0.2s ease' }}
                />

                {/* Value label on top of point */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={isHovered ? '13' : '11'}
                  fontWeight={isHovered ? '700' : '600'}
                >
                  {metricMode === 'temp'
                    ? `${pt.val}°`
                    : metricMode === 'pop'
                    ? `${pt.val}%`
                    : `${pt.val}`}
                </text>

                {/* 24-Hour Time Label below axis */}
                <text
                  x={pt.x}
                  y={height - paddingBottom + 22}
                  textAnchor="middle"
                  fill={isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.75)'}
                  fontSize="12"
                  fontWeight={isHovered ? '700' : '500'}
                  letterSpacing="0.03em"
                >
                  {pt.data.time}
                </text>

                {/* Invisible hover hitbox for smooth interactivity */}
                <rect
                  x={pt.x - stepX / 2}
                  y={0}
                  width={stepX}
                  height={height}
                  fill="transparent"
                  cursor="pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {activePoint && (
          <div
            className="graph-tooltip"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${(activePoint.y / height) * 100}%`
            }}
          >
            <div className="tooltip-time-badge">
              <span>{activePoint.data.time} (24h)</span>
            </div>
            <div className="tooltip-main-row">
              <span className="tooltip-icon">
                {getWeatherConditionIcon(activePoint.data.mainCondition || activePoint.data.description, 20)}
              </span>
              <span className="tooltip-temp">{toDisplayTemp(activePoint.data.temp)}</span>
            </div>
            <div className="tooltip-desc">{activePoint.data.description}</div>
            <div className="tooltip-submetrics">
              <span>💧 {activePoint.data.pop}% rain</span>
              <span>💨 {toDisplayWind(activePoint.data.windSpeed)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Hourly Quick Strip Icons */}
      <div className="hourly-strip-scroll">
        <div className="hourly-strip-track">
          {hourlyData.map((item, idx) => (
            <div
              key={`strip-${idx}`}
              className={`strip-hour-cell ${hoveredIndex === idx ? 'highlighted' : ''}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="strip-time-24h">{item.time}</span>
              <span className="strip-icon">
                {getWeatherConditionIcon(item.mainCondition || item.description, 24)}
              </span>
              <span className="strip-temp">{toDisplayTemp(item.temp)}</span>
              {item.pop > 0 && (
                <span className="strip-rain">
                  <DropletIcon size={12} /> {item.pop}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
