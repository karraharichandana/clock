import React, { useState, useEffect, useMemo } from 'react';
import './Countdown.css'; // Ensure you import your CSS file

const Countdown = ({ initialSeconds, onReset }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // State for muting/unmuting audio

  // Use useMemo to create audio instances, preventing them from being recreated on every render
  const tickAudio = useMemo(() => new Audio(`${process.env.PUBLIC_URL}/tick.wav`), []);
  const doneAudio = useMemo(() => new Audio(`${process.env.PUBLIC_URL}/done.wav`), []);

  useEffect(() => {
    let timer;
    let tickInterval;

    if (isRunning) {
      if (seconds > 0) {
        // Play ticking sound every second while the countdown is running
        if (!isMuted) tickAudio.play();
        tickInterval = setInterval(() => {
          setSeconds((prev) => prev - 1);
        }, 1000);
      } else {
        // Countdown finished
        doneAudio.loop = true; // Loop the done sound
        if (!isMuted) doneAudio.play(); // Play the done sound
      }
    }

    // Cleanup function
    return () => {
      clearInterval(timer);
      clearInterval(tickInterval);
      tickAudio.pause(); // Pause ticking sound when not running
      doneAudio.pause(); // Pause done sound
      doneAudio.currentTime = 0; // Reset done sound to the beginning
    };
  }, [isRunning, seconds, tickAudio, doneAudio, isMuted]);

  const handleStart = () => {
    setSeconds(initialSeconds); // Reset seconds when starting
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    tickAudio.pause(); // Pause ticking sound
    doneAudio.pause(); // Pause done sound
    doneAudio.currentTime = 0; // Reset done sound to the beginning
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(initialSeconds);
    onReset(); // Reset functionality
    tickAudio.pause(); // Pause ticking sound
    doneAudio.pause(); // Pause done sound
    doneAudio.currentTime = 0; // Reset done sound to the beginning
  };

  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev); // Toggle mute state
  };

  return (
    <div className="countdown-container">
      <h2>Countdown Timer</h2>
      <h3 className="countdown-display">{seconds > 0 ? seconds : 'Time is up!'}</h3>
      <div className="button-container">
        <button onClick={handleStart} disabled={isRunning || seconds === 0}>Start</button>
        <button onClick={handleStop} disabled={!isRunning}>Stop</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleMuteToggle}>{isMuted ? 'Unmute' : 'Mute'}</button>
      </div>
    </div>
  );
};

export default Countdown;
