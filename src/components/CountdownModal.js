import React, { useState } from 'react';

const CountdownModal = ({ onClose, onStartCountdown }) => {
  const [inputSeconds, setInputSeconds] = useState(60); // Default countdown time

  const handleStart = () => {
    onStartCountdown(inputSeconds);
    onClose(); // Close the modal after starting the countdown
  };

  return (
    <div className="modal">
      <h2>Set Countdown Time</h2>
      <input
        type="number"
        value={inputSeconds}
        onChange={(e) => setInputSeconds(Math.max(0, e.target.value))}
        min="0"
        placeholder="Enter seconds"
      />
      <button onClick={handleStart}>Start Countdown</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default CountdownModal;
