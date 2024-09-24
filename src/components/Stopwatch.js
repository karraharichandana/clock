// Stopwatch.js
import React, { useState, useEffect } from 'react';
import './Stopwatch.css'; // Ensure to import the CSS file

const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // Time in milliseconds
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10); // Update time every 10ms
      }, 10);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps((prevLaps) => [...prevLaps, time]);
  };

  const formatTime = (time) => {
    const getMilliseconds = `0${((time % 1000) / 10).toFixed(0)}`.slice(-2);
    const getSeconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
    const getMinutes = `0${Math.floor((time / (1000 * 60)) % 60)}`.slice(-2);
    return `${getMinutes}:${getSeconds}:${getMilliseconds}`;
  };

  return (
    <div className="stopwatch-container">
      <div className="stopwatch-display">{formatTime(time)}</div>
      <div className="button-container">
        <button onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>
        <button onClick={handleLap} disabled={!isRunning}>Lap</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div className="laps-container">
        {laps.length > 0 ? (
          laps.map((lap, index) => (
            <div key={index} className="lap-item">Lap {index + 1}: {formatTime(lap)}</div>
          ))
        ) : (
          <div>No laps recorded.</div>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;
