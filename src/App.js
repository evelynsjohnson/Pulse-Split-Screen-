import React, { useState } from 'react';
import Game from './components/Game';
import SongSelection from './components/SongSelection';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('selection'); // 'selection' or 'game'
  const [selectedSong, setSelectedSong] = useState(null);

  // Modified to not expect any parameters
  const handleBackToSelection = () => {
    setGameState('selection'); // Change to 'selection' instead of 'songSelection'
  };

  return (
    <div className="App">
      {gameState === 'selection' ? (
        <SongSelection
          onSongSelect={(song) => {
            setSelectedSong(song);
            setGameState('game');
          }}
        />
      ) : (
        <Game 
          songFile={selectedSong.file}
          songTimingKey={selectedSong.timingKey}
          onBackToSelection={handleBackToSelection}
        />
      )}
    </div>
  );
}

export default App;