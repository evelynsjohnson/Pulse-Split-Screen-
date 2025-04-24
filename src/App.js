import React, { useState } from 'react';
import Game from './components/Game';
import SongSelection from './components/SongSelection';
import StartMenu from './components/StartMenu';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('start');
  const [selectedSong, setSelectedSong] = useState(null);

  return (
    <div className="App">
      {gameState === 'start' && (
        <StartMenu
          onStartGame={() => setGameState('selection')}
        />
      )}
      {gameState === 'selection' && (
        <SongSelection
          onSongSelect={(song) => {
            setSelectedSong(song);
            setGameState('game');
          }}
          onBackToMenu={() => setGameState('start')}  // This is what you need to add
        />
      )}
      {gameState === 'game' && (
        <Game 
          songFile={selectedSong.file}
          songTimingKey={selectedSong.timingKey}
          onBackToSelection={() => setGameState('start')}
        />
      )}
    </div>
  );
}

export default App;