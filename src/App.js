import React, { useState } from 'react';
import Game from './components/Game';
import SongSelection from './components/SongSelection';
import './App.css';


function App() {
  const [gameState, setGameState] = useState({
    screen: 'selection', // 'selection' or 'game'
    selectedSong: null
  });

  const handleSongSelect = (song) => {
    setGameState({
      screen: 'game',
      selectedSong: song
    });
  };

  const handleBackToSelection = () => {
    setGameState({
      screen: 'selection',
      selectedSong: null
    });
  };

  return (
    <div className="App">
      {gameState.screen === 'selection' ? (
        <SongSelection onSongSelect={handleSongSelect} />
      ) : (
        <Game 
          songFile={gameState.selectedSong.file}
          songTimingKey={gameState.selectedSong.timingKey}
          onBackToSelection={handleBackToSelection}
        />
      )}
    </div>
  );
}

export default App;