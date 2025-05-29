import React from 'react';
import './Home.css';

const Home = ({ onNavigate, isOnline }) => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="app-title">🌭 SausageWraps</h1>
        <p className="app-subtitle">Capture & Rate Cycling Outfits</p>
        
        <div className="button-container">
          <button 
            className="main-button add-cyclist-btn"
            onClick={() => onNavigate('addCyclist')}
          >
            📸 AddCyclist
          </button>
          
          <button 
            className="main-button sausage-wraps-btn"
            onClick={() => onNavigate('sausageWraps')}
          >
            🏆 SausageWraps
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 