import React, { useState } from 'react';
import Game from './components/Game';
import SongSelection from './components/SongSelection';
import StartMenu from './components/StartMenu';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('start');
  const [selectedSong, setSelectedSong] = useState(null);
  const [lastSelectedSongIndex, setLastSelectedSongIndex] = useState(0); // Add this line

  return (
    <div className="App">
      {gameState === 'start' && (
        <StartMenu
          onStartGame={() => setGameState('selection')}
        />
      )}
      {gameState === 'selection' && (
        <SongSelection
          onSongSelect={(song, index) => { // Add index parameter
            setSelectedSong(song);
            setLastSelectedSongIndex(index); // Store the index
            setGameState('game');
          }}
          onBackToMenu={() => setGameState('start')}
          initialFocusedIndex={lastSelectedSongIndex} // Pass the last index
        />
      )}
      {gameState === 'game' && (
        <Game 
          songFile={selectedSong.file}
          songTimingKey={selectedSong.timingKey}
          onBackToSelection={() => setGameState('selection')} // Change to go back to selection
        />
      )}
    </div>
  );
}

export default App;