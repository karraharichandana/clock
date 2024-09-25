// Clock.js
import React from 'react';

const Clock = ({ is24HourFormat, showSeconds }) => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date) => {
    const istTime = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    let hours = istTime.getHours();
    const minutes = String(istTime.getMinutes()).padStart(2, '0');
    const seconds = String(istTime.getSeconds()).padStart(2, '0');

    if (!is24HourFormat) {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Convert to 12-hour format
      return showSeconds 
        ? `${hours}:${minutes}:${seconds} ${ampm}` 
        : `${hours}:${minutes} ${ampm}`;
    }
    return showSeconds 
      ? `${String(hours).padStart(2, '0')}:${minutes}:${seconds}` 
      : `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  const formatDate = (date) => {
    const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const day = istDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dateString = istDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return `${day}, ${dateString}`;
  };

  return (
    <div className="clock-container">
      <h1 className="clock">{formatTime(time)}</h1>
      <p className="date">{formatDate(time)}</p>
    </div>
  );
};

export default Clock;
