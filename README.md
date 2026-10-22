# 🌤️ Weather Forecast Application (Full-Stack)

A modern full-stack Weather Forecast web application built with a **React (Vite)** frontend and an **Express (Node.js)** backend, consuming the OpenWeatherMap API.

---

## 🚀 Features

- **React Frontend**:
  - Glassmorphic UI with dynamic blur and sleek purple/indigo aesthetics.
  - **24-Hour Weather Forecast Graph**: Interactive SVG trend chart in 24-hour time format with smooth bezier curves, interactive tooltips, high/low summaries, and metric toggles (Temperature, Rain Chance %, Wind).
  - **Next Week 7-Day Weather Table**: Structured forecast table displaying day/date, conditions, calibrated temperature spectrum bars, feels-like, precipitation chances, humidity %, and wind speeds.
  - **Expanded Weather Photography**: Dynamic background transitions according to specific weather conditions (`clear`, `sunny`, `partly-cloudy`, `cloudy`, `rain`, `heavy-rain`, `drizzle`, `snow`, `sleet`, `fog`, `windy`, `thunderstorm`).
  - Search any city worldwide with instant feedback and loading states.
  - Interactive **Popular Cities** cards with live min/max and current temperatures.
  - Metric (°C) and Imperial (°F) unit toggle.
  - Live local date & clock display.
  - Fully responsive across mobile, tablet, and desktop screens.

- **JavaScript / Express Backend**:
  - Securely proxies weather & 5-day / 3-hour forecast queries to OpenWeatherMap with automatic fallback resilience.
  - Endpoints:
    - `GET /api/weather?city=<name>`: Retrieves current weather, 24-hour timeline in 24h format, and 7-day weekly outlook.
    - `GET /api/forecast?city=<name>`: Dedicated forecast endpoint for 24h graph and 7-day table data.
    - `GET /api/popular`: Fetches current weather for predefined popular cities.
    - `GET /api/health`: Backend server status check.
  - Configurable via `.env` with environment fallback.

---

## 📁 Project Structure

```
Weather wAPI/
├── client/                     # React + Vite Frontend
│   ├── public/
│   │   └── images/             # Dynamic weather backgrounds & icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── DateDisplay.jsx
│   │   │   ├── HourlyForecastGraph.jsx  # 24-Hour weather graph (24h format)
│   │   │   ├── WeeklyForecastTable.jsx  # Next week 7-day forecast table
│   │   │   ├── PopularCities.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── WeatherCard.jsx
│   │   │   └── WeatherIcons.jsx
│   │   ├── App.jsx             # Main React application
│   │   ├── index.css           # Glassmorphism design system & styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js          # Configured with proxy to backend (/api)
│
├── server/                     # Express Node.js Backend
│   ├── server.js               # API routes & OpenWeatherMap integration
│   ├── .env                    # Environment variables (API Key & Port)
│   └── package.json
│
├── images/                     # Weather photography assets
├── package.json                # Root orchestration package
└── README.md
```

---

## 🛠️ How to Run

### 1. Install Dependencies
Run the one-step install script from the project root:
```bash
npm run install:all
```
*(Or install in `server/` and `client/` individually with `npm install` in each folder)*

### 2. Start Development Servers (One Command)
From the root directory:
```bash
npm run dev
```
This concurrently starts:
- **Express Backend** at `http://localhost:5000`
- **Vite React Frontend** at `http://localhost:5173`

Open [http://localhost:5173](http://localhost:5173) in your browser!

### Running Separately (Alternative)
- Start backend only:
  ```bash
  npm run dev:server
  ```
- Start frontend only:
  ```bash
  npm run dev:client
  ```
