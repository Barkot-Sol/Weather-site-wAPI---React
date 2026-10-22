import React, { useState, useEffect } from 'react';
import { CalendarIcon } from './WeatherIcons';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekdays = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export function DateDisplay() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dayName = weekdays[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="date-badge" title="Local Date and Time">
      <CalendarIcon size={16} />
      <span>{dayName}, {monthName} {dayOfMonth}, {year}</span>
      <span style={{ opacity: 0.6 }}>•</span>
      <span>{formattedTime}</span>
    </div>
  );
}
