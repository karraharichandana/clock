import React, { useState, useRef, useEffect } from 'react';
import Clock from './components/Clock';
import Stopwatch from './components/Stopwatch';
import Countdown from './components/Countdown'; // Import Countdown
import CountdownModal from './components/CountdownModal'; // Import CountdownModal
import './App.css';

const App = () => {
  const [activeComponent, setActiveComponent] = useState('clock');
  const [is24HourFormat, setIs24HourFormat] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [countdownTime, setCountdownTime] = useState(60); // Default countdown time
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const appRef = useRef(null);

  const startCountdown = (seconds) => {
    setCountdownTime(seconds);
    setActiveComponent('countdown'); // Switch to countdown component
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'clock':
        return <Clock is24HourFormat={is24HourFormat} />;
      case 'stopwatch':
        return <Stopwatch is24HourFormat={is24HourFormat} />;
      case 'countdown':
        return (
          <Countdown 
            initialSeconds={countdownTime} 
            onReset={() => setActiveComponent('clock')} // Reset functionality
          />
        );
      default:
        return <Clock />;
    }
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (appRef.current.requestFullscreen) {
        appRef.current.requestFullscreen();
      } else if (appRef.current.webkitRequestFullscreen) {
        appRef.current.webkitRequestFullscreen();
      } else if (appRef.current.msRequestFullscreen) {
        appRef.current.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.fullscreenElement) { // Check if currently in fullscreen
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isFullScreen && event.key === 'Escape') {
        if (document.fullscreenElement) { // Check if currently in fullscreen
          document.exitFullscreen();
          setIsFullScreen(false); // Update fullscreen state
        }
      }
    };

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false); // Update fullscreen state
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [isFullScreen]);

  return (
    <div ref={appRef} className={`app-container ${isFullScreen ? 'fullscreen' : ''}`}>
      {!isFullScreen && <h1>Clock App</h1>}
      {!isFullScreen && (
        <div className="buttons-container">
          <button onClick={() => setActiveComponent('clock')}>Clock</button>
          <button onClick={() => setActiveComponent('stopwatch')}>Stopwatch</button>
          <button onClick={() => setIsModalOpen(true)}>Countdown</button>
          <button onClick={toggleFullScreen}>
            {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          </button>
          <label className="switch-label">
            <input
              type="checkbox"
              checked={is24HourFormat}
              onChange={() => setIs24HourFormat((prev) => !prev)}
            />
            24-hour format
          </label>
        </div>
      )}

      <div className={`component-container ${isFullScreen ? 'fullscreen-clock' : ''}`}>
        {isFullScreen && (
          <button className="close-fullscreen" onClick={toggleFullScreen}>
            X
          </button>
        )}
        {renderComponent()}
      </div>

      {/* Modal for setting countdown time */}
      {isModalOpen && (
        <CountdownModal 
          onClose={() => setIsModalOpen(false)} 
          onStartCountdown={startCountdown} 
        />
      )}
    </div>
  );
};

export default App;
