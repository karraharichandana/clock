import React, { useState, useEffect, useRef } from 'react';
import './Stopwatch.css'; // Ensure to import the CSS file

const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // Time in milliseconds
  const [laps, setLaps] = useState([]);
  const startTimeRef = useRef(null); // Reference to track the start time
  const savedTimeRef = useRef(0); // To store the time elapsed before stopping
  const intervalId = useRef(null); // Reference for the interval ID

  useEffect(() => {
    // Check if there's any saved state (if user refreshes page, for example)
    const storedStartTime = localStorage.getItem('stopwatchStartTime');
    const storedSavedTime = localStorage.getItem('stopwatchSavedTime');

    if (storedStartTime && storedSavedTime) {
      const currentTime = Date.now();
      const savedTime = Number(storedSavedTime);
      const elapsedTime = currentTime - Number(storedStartTime);
      setTime(savedTime + elapsedTime);
      startTimeRef.current = Number(storedStartTime);
      savedTimeRef.current = savedTime;

      // Restart the stopwatch automatically
      intervalId.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setTime(savedTime + elapsed);
      }, 100);
      setIsRunning(true);
    }

    return () => {
      clearInterval(intervalId.current); // Clean up interval on unmount
    };
  }, []);

  const handleStartStop = () => {
    if (isRunning) {
      // Stop the stopwatch
      clearInterval(intervalId.current);
      savedTimeRef.current = time; // Save the current time
      localStorage.setItem('stopwatchSavedTime', savedTimeRef.current); // Save to localStorage
      setIsRunning(false);
      localStorage.removeItem('stopwatchStartTime'); // Remove start time from storage
    } else {
      // Start the stopwatch
      const currentTime = Date.now();
      startTimeRef.current = currentTime; // Record the current start time
      localStorage.setItem('stopwatchStartTime', currentTime); // Save to localStorage
      intervalId.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setTime(savedTimeRef.current + elapsed);
      }, 100);
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    clearInterval(intervalId.current); // Stop the interval
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    savedTimeRef.current = 0;
    localStorage.removeItem('stopwatchStartTime'); // Clear storage
    localStorage.removeItem('stopwatchSavedTime'); // Clear storage
  };

  const handleLap = () => {
    setLaps((prevLaps) => [...prevLaps, time]); // Record the current time as a lap
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
