import React, { useState, useEffect } from 'react';
import './TruthLie.css';

// Predefined truths for specific users (moved outside component to avoid useEffect dependency)
const predefinedTruths = {
  'Tomas': [
    "When I was a teenager, this girl in our yard went into labor, and before the ambulance arrived, I helped her give birth.",
    "While drunk and walking across the street in downtown Kaunas, I was randomly hit by a car — the driver was my own father."
  ],
  'Linas': [
    "I once was forced to jump out of a moving car.",
    "I once hit another car while I was stoned and drove off. They found me later and suspended my license for six months."
  ],
  'Teo': [
    "I got kicked out of university.",
    "" // Second truth to be added by user
  ]
};

const TruthLie = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTruths, setUserTruths] = useState({});
  const [currentTruths, setCurrentTruths] = useState(['', '']);
  const [gameResult, setGameResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [usedLies, setUsedLies] = useState([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Predefined users
  const users = ['Tomas', 'Teo', 'Linas', 'Deivydas', 'Gerrit'];

  // Lie bank
  const lieBank = [
    "I once faked a panic attack to avoid karaoke at my own birthday party.",
    "I legally changed my name for 24 hours just to win a radio contest.",
    "I've been mistaken for a priest twice — once at a wedding, once at a bar.",
    "I started actually hating someone because of their weird laugh.",
    "My cousin tried to baptize a cat and it ended up in the local newspaper.",
    "I've had to pretend to be someone else's spouse in an emergency room.",
    "At age 15, I once used my own semen as face cream. My grandma walked in. We didn't talk for 3 weeks.",
    "I spent two weeks faking migraines because I thought I was allergic to other people's breathing.",
    "I helped push a burning car out of a garage while barefoot.",
    "I dislocated my shoulder trying to kick down a locked bathroom door — from the inside.",
    "I peed in a bottle and forgot about it until someone thought it was kombucha.",
    "I once sent myself flowers at work for attention.",
    "I set a plastic RC car on fire using a magnifying glass and blamed it on a 'strange light beam.'",
    "I used to check my grandma's teeth while she slept — multiple times."
  ];

  // Load saved data from localStorage
  useEffect(() => {
    const savedTruths = localStorage.getItem('truthLie_userTruths');
    const savedUsedLies = localStorage.getItem('truthLie_usedLies');
    
    if (savedTruths) {
      const parsed = JSON.parse(savedTruths);
      setUserTruths(parsed);
    } else {
      // Initialize with predefined truths
      setUserTruths(predefinedTruths);
      localStorage.setItem('truthLie_userTruths', JSON.stringify(predefinedTruths));
    }

    if (savedUsedLies) {
      const parsedUsedLies = JSON.parse(savedUsedLies);
      setUsedLies(parsedUsedLies);
    }
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    if (password === '999999') {
      setIsAuthenticated(true);
      setShowAdminPanel(false); // Ensure we go to game, not admin
    } else {
      alert('Incorrect password!');
    }
    e.target.reset();
  };

  const handleAdminPasswordSubmit = (e) => {
    e.preventDefault();
    const password = e.target.adminPassword.value;
    if (password === 'resetapp') {
      setShowAdminPanel(true);
      setIsAuthenticated(true); // Also authenticate for admin
    } else {
      alert('Incorrect admin password!');
    }
    e.target.reset();
  };

  const handleResetGame = () => {
    if (window.confirm('Are you sure you want to reset the entire Truth & Lie game? This will clear all used lies and allow them to be used again.')) {
      // Clear used lies
      setUsedLies([]);
      localStorage.removeItem('truthLie_usedLies');
      
      // Reset game state
      setGameResult(null);
      setShowResult(false);
      
      alert('Game has been reset! All lies can now be used again.');
    }
  };

  const handleBackFromAdmin = () => {
    setShowAdminPanel(false);
    setIsAuthenticated(false);
    setSelectedUser(null);
    setCurrentTruths(['', '']);
    setGameResult(null);
    setShowResult(false);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    const existingTruths = userTruths[user] || ['', ''];
    setCurrentTruths([...existingTruths]);
    setGameResult(null);
    setShowResult(false);
  };

  const handleTruthChange = (index, value) => {
    const newTruths = [...currentTruths];
    newTruths[index] = value;
    setCurrentTruths(newTruths);
  };

  const handleSaveAndAdd = () => {
    if (currentTruths[0].trim() === '' || currentTruths[1].trim() === '') {
      alert('Please enter both truths!');
      return;
    }

    const updatedUserTruths = {
      ...userTruths,
      [selectedUser]: [...currentTruths]
    };
    
    setUserTruths(updatedUserTruths);
    localStorage.setItem('truthLie_userTruths', JSON.stringify(updatedUserTruths));
    
    alert('Truths saved successfully!');
  };

  const handleShuffle = () => {
    const userSpecificTruths = userTruths[selectedUser] || [];
    
    // Filter out empty truths
    const validTruths = userSpecificTruths.filter(truth => truth.trim() !== '');
    
    if (validTruths.length < 2) {
      alert('Please add both truths first!');
      return;
    }

    // Get available lies (not used yet)
    const availableLies = lieBank.filter(lie => !usedLies.includes(lie));
    
    if (availableLies.length < 2) {
      alert('Not enough lies available! Contact admin to reset the game.');
      return;
    }

    // Get 2 random lies from available lies
    const shuffledLies = [...availableLies].sort(() => 0.5 - Math.random());
    const selectedLies = shuffledLies.slice(0, 2);

    // Combine truths and lies
    const allStatements = [...validTruths, ...selectedLies];
    
    // Shuffle and pick one random statement
    const shuffledStatements = allStatements.sort(() => 0.5 - Math.random());
    const selectedStatement = shuffledStatements[0];
    
    // Determine if it's a truth or lie
    const isTruth = validTruths.includes(selectedStatement);
    const isLie = selectedLies.includes(selectedStatement);
    
    // If it's a lie, mark it as used
    if (isLie) {
      const updatedUsedLies = [...usedLies, selectedStatement];
      setUsedLies(updatedUsedLies);
      localStorage.setItem('truthLie_usedLies', JSON.stringify(updatedUsedLies));
    }
    
    setGameResult({
      statement: selectedStatement,
      isTrue: isTruth,
      type: isTruth ? 'TRUTH' : 'LIE'
    });
    setShowResult(true);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setCurrentTruths(['', '']);
    setGameResult(null);
    setShowResult(false);
  };

  const getAvailableLiesCount = () => {
    return lieBank.filter(lie => !usedLies.includes(lie)).length;
  };

  if (!isAuthenticated) {
    return (
      <div className="truth-lie-container">
        <div className="truth-lie-content">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          
          <h1 className="truth-lie-title">🎭 Truth & Lie</h1>
          <p className="truth-lie-subtitle">Enter password to access</p>
          
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="password-input"
              autoComplete="off"
            />
            <button type="submit" className="password-submit">
              Enter Game
            </button>
          </form>

          <div className="admin-section">
            <p className="admin-text">Admin Access</p>
            <form onSubmit={handleAdminPasswordSubmit} className="admin-form">
              <input
                type="password"
                name="adminPassword"
                placeholder="Admin password"
                className="admin-input"
                autoComplete="off"
              />
              <button type="submit" className="admin-submit">
                Admin Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (showAdminPanel) {
    return (
      <div className="truth-lie-container">
        <div className="truth-lie-content">
          <button className="back-button" onClick={handleBackFromAdmin}>
            ← Back to Login
          </button>
          
          <h1 className="truth-lie-title">🔧 Admin Panel</h1>
          <p className="truth-lie-subtitle">Game Management</p>
          
          <div className="admin-stats">
            <div className="stat-item">
              <span className="stat-label">Used Lies:</span>
              <span className="stat-value">{usedLies.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Available Lies:</span>
              <span className="stat-value">{getAvailableLiesCount()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Users:</span>
              <span className="stat-value">{users.length}</span>
            </div>
          </div>

          <div className="used-truths-list">
            <h3>Used Lies:</h3>
            {usedLies.length === 0 ? (
              <p className="no-used-truths">No lies have been used yet.</p>
            ) : (
              <ul className="truths-list">
                {usedLies.map((lie, index) => (
                  <li key={index} className="truth-item">"{lie}"</li>
                ))}
              </ul>
            )}
          </div>
          
          <button className="reset-button" onClick={handleResetGame}>
            🔄 Reset Game
          </button>
        </div>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="truth-lie-container">
        <div className="truth-lie-content">
          <button className="back-button" onClick={() => setIsAuthenticated(false)}>
            ← Back to Login
          </button>
          
          <h1 className="truth-lie-title">🎭 Truth & Lie</h1>
          <p className="truth-lie-subtitle">Select your name</p>
          
          <div className="users-grid">
            {users.map(user => {
              const userSpecificTruths = userTruths[user] || [];
              const validTruths = userSpecificTruths.filter(truth => truth.trim() !== '').length;
              
              return (
                <button
                  key={user}
                  className="user-button"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-name">{user}</div>
                  <div className="user-truths-count">
                    {validTruths} truth{validTruths !== 1 ? 's' : ''} ready
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="truth-lie-container">
      <div className="truth-lie-content">
        <button className="back-button" onClick={handleBackToUsers}>
          ← Back to Users
        </button>
        
        <h1 className="truth-lie-title">🎭 {selectedUser}</h1>
        
        {!showResult ? (
          <div className="truth-input-section">
            <p className="truth-lie-subtitle">Enter your 2 truths</p>
            
            <div className="truth-inputs">
              <div className="truth-input-group">
                <label>Truth 1:</label>
                <textarea
                  value={currentTruths[0]}
                  onChange={(e) => handleTruthChange(0, e.target.value)}
                  placeholder="Enter your first truth..."
                  className="truth-textarea"
                />
              </div>
              
              <div className="truth-input-group">
                <label>Truth 2:</label>
                <textarea
                  value={currentTruths[1]}
                  onChange={(e) => handleTruthChange(1, e.target.value)}
                  placeholder="Enter your second truth..."
                  className="truth-textarea"
                />
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                className="save-button"
                onClick={handleSaveAndAdd}
              >
                Save & Add
              </button>
              
              <button 
                className="shuffle-button"
                onClick={handleShuffle}
                disabled={getAvailableLiesCount() < 2}
              >
                🎲 Shuffle
              </button>
            </div>
            
            {getAvailableLiesCount() < 2 && (
              <p className="no-truths-message">
                Game pool exhausted! Contact admin to reset.
              </p>
            )}
          </div>
        ) : (
          <div className="game-result">
            <div className="result-card">
              <div className="result-statement">
                "{gameResult.statement}"
              </div>
              <div className="result-instruction">
                Say this as if it were true!
              </div>
            </div>
            
            <button 
              className="shuffle-again-button"
              onClick={handleShuffle}
              disabled={getAvailableLiesCount() < 2}
            >
              🎲 Shuffle Again
            </button>
            
            {getAvailableLiesCount() < 2 && (
              <p className="no-truths-message">
                Game pool exhausted! Contact admin to reset.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TruthLie; 