import React, { useState } from 'react';
import './SausageWraps.css';

const SausageWraps = ({ onBack, cyclists, onUpvote, userVotes, onClearAllData, isOnline }) => {
  const [toast, setToast] = useState(null);

  // Array of random funny phrases for voting
  const voteMessages = [
    "This outfit's so hot, Vogue called — they want it back! 🔥",
    "When comfort and shame find common ground. 😅",
    "Some wear armor, some wear… this. ⚔️",
    "Spotted: a rare roadie peacock in mating display 🦚",
    "Not a racer, just late for his mid-life crisis 🏃‍♂️",
    "This outfit caused a divorce 💔",
    "Idk, looks like space sausage to me 🚀🌭",
    "Vogue's on the line asking for a photoshoot 📞✨",
    "Built for speed, dressed for confusion 🏎️❓",
    "This isn't cycling… it's performance art in pain 🎭",
    "He woke up and chose this, lel? 😴",
    "Fashion sense of a baguette 🥖",
    "If confidence was fabric, this man used it all. 💪",
    "Aerodynamic? Sure. Dignified? Absolutely not. 💨",
    "Wind tunnel tested. Socially rejected. 🌪️❌"
  ];

  const handleUpvote = (id) => {
    const success = onUpvote(id);
    if (success) {
      // Get a random message from the array
      const randomMessage = voteMessages[Math.floor(Math.random() * voteMessages.length)];
      
      // Show toast notification
      setToast(randomMessage);
      setTimeout(() => setToast(null), 5000); // Show for 5 seconds instead of 3
      
    } else if (userVotes.count >= 2) {
      alert("You've used all your votes.");
    } else if (userVotes.votedImages.includes(id)) {
      alert("You've already voted for this cyclist.");
    }
  };

  const sortedCyclists = [...cyclists].sort((a, b) => b.votes - a.votes);

  const canVote = (id) => {
    return userVotes.count < 2 && !userVotes.votedImages.includes(id);
  };

  // Clear all data function with password protection
  const clearAllData = () => {
    const confirmClear = window.confirm(
      "⚠️ Are you sure you want to delete ALL cyclist photos and votes? This cannot be undone!"
    );
    
    if (confirmClear) {
      // Ask for password
      const password = window.prompt("🔒 Enter the access code to confirm deletion:");
      
      if (password === '135') {
        // Call the clear function from App.js
        onClearAllData();
        alert('All data cleared successfully! 🗑️');
      } else if (password !== null) {
        // User entered something but it was wrong (null means they cancelled)
        alert('❌ Incorrect code. Data not cleared.');
      }
      // If password is null (cancelled), do nothing
    }
  };

  return (
    <div className="sausage-wraps-container">
      <div className="sausage-wraps-content">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        
        <h2>🏆 SausageWraps Leaderboard</h2>
        
        {/* Online Status Indicator */}
        <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
          <span className="status-dot"></span>
          {isOnline ? '🌐 Live Multi-player' : '📱 Offline Mode'}
        </div>
        
        <div className="vote-status">
          <p>Votes remaining: {2 - userVotes.count}/2</p>
          {userVotes.count >= 2 && (
            <p className="vote-limit-message">You've used all your votes!</p>
          )}
        </div>

        {sortedCyclists.length === 0 ? (
          <div className="empty-state">
            <p>No cyclists added yet!</p>
            <p>Use AddCyclist to get started.</p>
            {!isOnline && (
              <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '10px' }}>
                📱 Running in offline mode
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="cyclists-grid">
              {sortedCyclists.map((cyclist, index) => (
                <div key={cyclist.id} className="cyclist-card">
                  <div className="rank-badge">#{index + 1}</div>
                  
                  <h3 className="cyclist-name">{cyclist.name}</h3>
                  
                  <div className="image-container">
                    <img 
                      src={cyclist.image} 
                      alt={cyclist.name}
                      className="cyclist-image"
                    />
                  </div>
                  
                  <div className="vote-section">
                    <div className="vote-count">
                      ❤️ {cyclist.votes} {cyclist.votes === 1 ? 'vote' : 'votes'}
                    </div>
                    
                    <button
                      className={`upvote-button ${!canVote(cyclist.id) ? 'disabled' : ''}`}
                      onClick={() => handleUpvote(cyclist.id)}
                      disabled={!canVote(cyclist.id)}
                    >
                      {userVotes.votedImages.includes(cyclist.id) ? '✅ Voted' : '👍 Upvote'}
                    </button>
                  </div>
                  
                  <div className="timestamp">
                    Added: {new Date(cyclist.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Clear All Data Button */}
            <div className="clear-data-section">
              <button className="clear-all-button" onClick={clearAllData}>
                🗑️ Clear All Data
              </button>
              <p className="clear-data-hint">Requires access code for security</p>
            </div>
          </>
        )}
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <div className="toast-notification">
          <div className="toast-content">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
};

export default SausageWraps; 