import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './components/Home';
import AddCyclist from './components/AddCyclist';
import SausageWraps from './components/SausageWraps';
import TruthLie from './components/TruthLie';
import { cyclistsAPI, userVotesAPI } from './supabaseClient';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [cyclists, setCyclists] = useState([]);
  const [userVotes, setUserVotes] = useState({ count: 0, votedImages: [] });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Load data on app start
  useEffect(() => {
    loadData();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    let subscription;
    
    if (isOnline) {
      subscription = cyclistsAPI.subscribeToChanges((payload) => {
        console.log('Real-time update:', payload);
        // Refresh data when changes occur
        loadCyclists();
      });
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isOnline]);

  const loadData = async () => {
    try {
      // Load cyclists from Supabase
      await loadCyclists();
      
      // Load user votes from localStorage
      const votes = userVotesAPI.get();
      setUserVotes(votes);
      
      setIsOnline(true);
    } catch (error) {
      console.error('Failed to load from Supabase, using localStorage:', error);
      // Fallback to localStorage if Supabase fails
      loadFromLocalStorage();
      setIsOnline(false);
    }
    setIsLoaded(true);
  };

  const loadCyclists = async () => {
    try {
      const data = await cyclistsAPI.getAll();
      setCyclists(data);
      console.log('Loaded cyclists from Supabase:', data.length);
    } catch (error) {
      console.error('Error loading cyclists:', error);
      throw error;
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedCyclists = localStorage.getItem('sausageWraps_cyclists');
      const savedVotes = localStorage.getItem('sausageWraps_userVotes');
      
      if (savedCyclists) {
        const parsedCyclists = JSON.parse(savedCyclists);
        setCyclists(parsedCyclists);
        console.log('Loaded cyclists from localStorage:', parsedCyclists.length);
      }
      
      if (savedVotes) {
        const parsedVotes = JSON.parse(savedVotes);
        setUserVotes(parsedVotes);
        console.log('Loaded votes from localStorage:', parsedVotes);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setCyclists([]);
      setUserVotes({ count: 0, votedImages: [] });
    }
  };

  const addCyclist = async (name, imageData) => {
    const newCyclist = {
      name,
      image: imageData,
      votes: 0,
      timestamp: new Date().toISOString()
    };

    if (isOnline) {
      try {
        const savedCyclist = await cyclistsAPI.add(newCyclist);
        if (savedCyclist) {
          // Real-time subscription will update the list
          console.log('Cyclist added to Supabase:', savedCyclist);
        }
      } catch (error) {
        console.error('Failed to add to Supabase, adding locally:', error);
        addCyclistLocally(newCyclist);
      }
    } else {
      addCyclistLocally(newCyclist);
    }
  };

  const addCyclistLocally = (newCyclist) => {
    const cyclistWithId = {
      ...newCyclist,
      id: Date.now()
    };
    
    setCyclists(prev => {
      const updated = [...prev, cyclistWithId];
      // Save to localStorage as backup
      localStorage.setItem('sausageWraps_cyclists', JSON.stringify(updated));
      console.log('Adding cyclist locally, total now:', updated.length);
      return updated;
    });
  };

  const upvoteCyclist = async (id) => {
    // Check if user has votes left and hasn't voted for this image
    if (userVotes.count >= 2 || userVotes.votedImages.includes(id)) {
      return false;
    }

    // Find the cyclist to update
    const cyclist = cyclists.find(c => c.id === id);
    if (!cyclist) return false;

    const newVotes = cyclist.votes + 1;

    if (isOnline) {
      try {
        await cyclistsAPI.updateVotes(id, newVotes);
        console.log('Vote updated in Supabase');
      } catch (error) {
        console.error('Failed to update vote in Supabase:', error);
        // Continue with local update
      }
    }

    // Update local state
    setCyclists(prev => 
      prev.map(cyclist => 
        cyclist.id === id 
          ? { ...cyclist, votes: newVotes }
          : cyclist
      )
    );

    // Update user votes
    const updatedUserVotes = {
      count: userVotes.count + 1,
      votedImages: [...userVotes.votedImages, id]
    };
    setUserVotes(updatedUserVotes);
    userVotesAPI.save(updatedUserVotes);

    // Save to localStorage as backup
    if (!isOnline) {
      const updatedCyclists = cyclists.map(cyclist => 
        cyclist.id === id 
          ? { ...cyclist, votes: newVotes }
          : cyclist
      );
      localStorage.setItem('sausageWraps_cyclists', JSON.stringify(updatedCyclists));
    }

    return true;
  };

  const clearAllData = async () => {
    if (isOnline) {
      try {
        await cyclistsAPI.clearAll();
        console.log('All data cleared from Supabase');
      } catch (error) {
        console.error('Failed to clear Supabase data:', error);
      }
    }

    // Clear local data
    localStorage.removeItem('sausageWraps_cyclists');
    userVotesAPI.clear();
    
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
            isOnline={isOnline}
          />
        );
      case 'truthLie':
        return (
          <TruthLie 
            onBack={() => setCurrentView('home')}
          />
        );
      default:
        return (
          <Home 
            onNavigate={setCurrentView}
            isOnline={isOnline}
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
          fontSize: '18px',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div>Loading SausageWraps... 🌭</div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            {isOnline ? 'Connecting to database...' : 'Loading offline data...'}
          </div>
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