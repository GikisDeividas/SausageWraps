import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './components/Home';
import AddCyclist from './components/AddCyclist';
import SausageWraps from './components/SausageWraps';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [cyclists, setCyclists] = useState([]);
  const [userVotes, setUserVotes] = useState({ count: 0, votedImages: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on app start
  useEffect(() => {
    try {
      const savedCyclists = localStorage.getItem('sausageWraps_cyclists');
      const savedVotes = localStorage.getItem('sausageWraps_userVotes');
      
      if (savedCyclists) {
        const parsedCyclists = JSON.parse(savedCyclists);
        setCyclists(parsedCyclists);
        console.log('Loaded cyclists:', parsedCyclists.length);
      }
      
      if (savedVotes) {
        const parsedVotes = JSON.parse(savedVotes);
        setUserVotes(parsedVotes);
        console.log('Loaded votes:', parsedVotes);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Reset to defaults if there's an error
      setCyclists([]);
      setUserVotes({ count: 0, votedImages: [] });
    }
    setIsLoaded(true);
  }, []);

  // Save cyclists to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('sausageWraps_cyclists', JSON.stringify(cyclists));
        console.log('Saved cyclists:', cyclists.length);
      } catch (error) {
        console.error('Error saving cyclists to localStorage:', error);
      }
    }
  }, [cyclists, isLoaded]);

  // Save user votes to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('sausageWraps_userVotes', JSON.stringify(userVotes));
        console.log('Saved votes:', userVotes);
      } catch (error) {
        console.error('Error saving votes to localStorage:', error);
      }
    }
  }, [userVotes, isLoaded]);

  const addCyclist = (name, imageData) => {
    const newCyclist = {
      id: Date.now(),
      name,
      image: imageData,
      votes: 0,
      timestamp: new Date().toISOString()
    };
    setCyclists(prev => {
      const updated = [...prev, newCyclist];
      console.log('Adding cyclist, total now:', updated.length);
      return updated;
    });
  };

  const upvoteCyclist = (id) => {
    // Check if user has votes left and hasn't voted for this image
    if (userVotes.count >= 2 || userVotes.votedImages.includes(id)) {
      return false;
    }

    // Update cyclist votes
    setCyclists(prev => 
      prev.map(cyclist => 
        cyclist.id === id 
          ? { ...cyclist, votes: cyclist.votes + 1 }
          : cyclist
      )
    );

    // Update user votes
    setUserVotes(prev => ({
      count: prev.count + 1,
      votedImages: [...prev.votedImages, id]
    }));

    return true;
  };

  const clearAllData = () => {
    // Clear localStorage
    localStorage.removeItem('sausageWraps_cyclists');
    localStorage.removeItem('sausageWraps_userVotes');
    
    // Clear React state
    setCyclists([]);
    setUserVotes({ count: 0, votedImages: [] });
    
    console.log('All data cleared');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'addCyclist':
        return (
          <AddCyclist 
            onBack={() => setCurrentView('home')}
            onAddCyclist={addCyclist}
          />
        );
      case 'sausageWraps':
        return (
          <SausageWraps 
            onBack={() => setCurrentView('home')}
            cyclists={cyclists}
            onUpvote={upvoteCyclist}
            userVotes={userVotes}
            onClearAllData={clearAllData}
          />
        );
      default:
        return (
          <Home 
            onNavigate={setCurrentView}
          />
        );
    }
  };

  // Don't render until data is loaded
  if (!isLoaded) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: 'white',
          fontSize: '18px'
        }}>
          Loading SausageWraps... 🌭
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;
