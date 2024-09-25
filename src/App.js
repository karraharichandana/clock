import React, { useState, useRef, useEffect } from 'react';
import Clock from './components/Clock';
import Stopwatch from './components/Stopwatch';
import Countdown from './components/Countdown';
import CountdownModal from './components/CountdownModal';
import './App.css';

const App = () => {
  const [activeComponent, setActiveComponent] = useState('clock');
  const [is24HourFormat, setIs24HourFormat] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSeconds, setShowSeconds] = useState(false);
  const [countdownTime, setCountdownTime] = useState(60);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fontColor, setFontColor] = useState('white');
  const [fontSize, setFontSize] = useState('18px');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [bgColor, setBgColor] = useState('black');
  const [bgImage, setBgImage] = useState(null);
  const appRef = useRef(null);

  const isDesktop = window.innerWidth >= 1024;

  const startCountdown = (seconds) => {
    setCountdownTime(seconds);
    setActiveComponent('countdown');
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'clock':
        return <Clock is24HourFormat={is24HourFormat} showSeconds={showSeconds} />;
      case 'stopwatch':
        return <Stopwatch is24HourFormat={is24HourFormat} />;
      case 'countdown':
        return <Countdown initialSeconds={countdownTime} onReset={() => setActiveComponent('clock')} />;
      default:
        return <Clock showSeconds={showSeconds} />;
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
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isFullScreen && event.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullScreen(false);
        }
      }
    };

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [isFullScreen]);

  const applyStyles = () => {
    document.documentElement.style.setProperty('--font-color', fontColor);
    document.documentElement.style.setProperty('--font-size', fontSize);
    document.documentElement.style.setProperty('--font-family', fontFamily);
    document.body.style.backgroundColor = bgColor;
    if (bgImage) {
      document.body.style.backgroundImage = `url(${bgImage})`;
      document.body.style.backgroundSize = 'cover';
    }
    document.body.style.transformOrigin = 'top left';
  };

  useEffect(applyStyles, [fontColor, fontSize, fontFamily, bgColor, bgImage]);

  if (!isDesktop) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>This app is only available on desktop devices.</div>;
  }

  return (
    <div ref={appRef} className={`app-container ${isFullScreen ? 'fullscreen' : ''}`} style={{ overflowY: 'auto', height: '100vh' }}>
      <span className="menu-icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</span>
      {!isFullScreen && (
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ fontSize: '16px' }}>
          <h3>Settings</h3>
          <label>
            Font Color:
            <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
          </label>
          <label>
            Background Color:
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </label>
          <label>
            Background Image:
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setBgImage(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }} />
          </label>
          <label>
            Font Size:
            <input type="number" value={fontSize.replace('px', '')} onChange={(e) => setFontSize(`${e.target.value}px`)} />
          </label>
          <label>
            Font Style:
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
              <option value="Arial">Arial</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Poppins">Poppins</option>
              <option value="Raleway">Raleway</option>
              <option value="Pacifico">Pacifico</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Lobster">Lobster</option>
              <option value="Bangers">Bangers</option>
              <option value="Luckiest Guy">Luckiest Guy</option>
              <option value="Dancing Script">Dancing Script</option>
              <option value="Great Vibes">Great Vibes</option>
              <option value="Sacramento">Sacramento</option>
              <option value="Alex Brush">Alex Brush</option>
              <option value="Alegreya">Alegreya</option>
              <option value="Merriweather">Merriweather</option>
              <option value="Noto Sans">Noto Sans</option>
              <option value="Source Sans Pro">Source Sans Pro</option>
              <option value="Inter">Inter</option>
              <option value="Libre Franklin">Libre Franklin</option>
              <option value="Rubik">Rubik</option>
              <option value="Fira Sans">Fira Sans</option>
              <option value="Gilroy">Gilroy</option>
              <option value="Quicksand">Quicksand</option>
            </select>
          </label>
          <label className="switch-label">
            <input type="checkbox" checked={is24HourFormat} onChange={() => setIs24HourFormat((prev) => !prev)} />
            <span>24-hour format</span>
          </label>
          <label className="switch-label">
            <input type="checkbox" checked={showSeconds} onChange={() => setShowSeconds((prev) => !prev)} />
            <span>Show Seconds</span>
          </label>
          <button onClick={toggleFullScreen}>
            {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          </button>
          <br />
          <br />
          <button onClick={() => setIsSidebarOpen(false)}>Close</button>
        </div>
      )}
      {!isFullScreen && <h1>Clock App</h1>}
      {!isFullScreen && (
        <div className="buttons-container">
          <button onClick={() => setActiveComponent('clock')}>Clock</button>
          <button onClick={() => setActiveComponent('stopwatch')}>Stopwatch</button>
          <button onClick={() => setIsModalOpen(true)}>Countdown</button>
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
      {isModalOpen && (
        <CountdownModal onClose={() => setIsModalOpen(false)} onStartCountdown={startCountdown} />
      )}
    </div>
  );
};

export default App;
