import React, { useState, useEffect, useMemo } from 'react';
import './Countdown.css'; // Ensure you import your CSS file

const Countdown = ({ initialSeconds, onReset }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // State for muting/unmuting audio

  const tickAudio = useMemo(() => new Audio(`${process.env.PUBLIC_URL}/tick.wav`), []);
  const doneAudio = useMemo(() => new Audio(`${process.env.PUBLIC_URL}/done.wav`), []);

  useEffect(() => {
    let timer;

    if (isRunning) {
      // Start a timer to decrement seconds
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev > 1) {
            // Play tick sound
            if (!isMuted) {
              tickAudio.play().catch((error) => console.error("Audio play error: ", error));
            }
            return prev - 1;
          } else {
            // Countdown finished
            doneAudio.loop = true;
            if (!isMuted) {
              doneAudio.play().catch((error) => console.error("Audio play error: ", error));
            }
            clearInterval(timer); // Stop the interval when done
            return 0; // Set seconds to 0 when done
          }
        });
      }, 1000);
    }

    // Cleanup function
    return () => {
      clearInterval(timer);
      // Reset audio
      tickAudio.pause();
      doneAudio.pause();
      doneAudio.currentTime = 0; // Reset done sound to the beginning
    };
  }, [isRunning, tickAudio, doneAudio, isMuted]);

  const handleStart = () => {
    if (seconds > 0) {
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(initialSeconds); // Reset to initial seconds
    onReset(); // Call reset function
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
        <button onClick={handleStart} disabled={isRunning || seconds <= 0}>Start</button>
        <button onClick={handleStop} disabled={!isRunning}>Stop</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleMuteToggle}>{isMuted ? 'Unmute' : 'Mute'}</button>
      </div>
    </div>
  );
};

export default Countdown;
