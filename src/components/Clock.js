// Clock.js
import React from 'react';

const Clock = ({ is24HourFormat }) => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    if (!is24HourFormat) {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Convert to 12-hour format
      return `${hours}:${minutes}:${seconds} ${ampm}`;
    }
    return `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
  };

  return (
    <div className="clock-container">
      <h1 className="clock">{formatTime(time)}</h1>
    </div>
  );
};

export default Clock;
