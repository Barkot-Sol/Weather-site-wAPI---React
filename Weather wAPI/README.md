# 🌤️ Weather Forecast Application (Full-Stack)

A modern full-stack Weather Forecast web application built with a **React (Vite)** frontend and an **Express (Node.js)** backend, consuming the OpenWeatherMap API.

---

## 🚀 Features

- **React Frontend**:
  - Glassmorphic UI with dynamic blur and sleek purple/indigo aesthetics.
  - Dynamic background transitions according to weather conditions (`clear`, `rain`, `clouds`, `snow`, `thunderstorm`, `drizzle`).
  - Search any city worldwide with instant feedback and loading states.
  - Interactive **Popular Cities** cards with live min/max and current temperatures.
  - Metric (°C) and Imperial (°F) unit toggle.
  - Live local date & clock display.
  - Fully responsive across mobile, tablet, and desktop screens.

- **JavaScript / Express Backend**:
  - Securely proxies weather queries to OpenWeatherMap without exposing frontend business logic.
  - Endpoints:
    - `GET /api/weather?city=<name>`: Retrieves detailed current weather, conditions, temperature ranges, humidity, wind speed, and matching background asset.
    - `GET /api/popular`: Fetches current weather for predefined popular cities (London, New York, Buenos Aires, Tokyo, Addis Ababa, Liverpool).
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
├── images/                     # Original image assets
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
