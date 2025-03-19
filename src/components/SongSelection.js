import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import yiamCover from '../assets/yes_im_a_mess_cover.jpg';
import teethCover from '../assets/teeth_cover.png';
import soyCover from '../assets/shape_of_you_cover.png';

const SongSelection = ({ onSongSelect }) => {
  const [selectedSong, setSelectedSong] = useState(null);
  const [hover, setHover] = useState(null);

  const songs = [
    {
      id: 'soy',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      cover: soyCover,
      file: 'shape_of_you.mp3',
      timingKey: 'SOYSongTiming',
      difficulty: 'Medium'
    },
    {
      id: 'yiam',
      title: 'Yes I\'m a Mess',
      artist: 'AJR',
      cover: yiamCover,
      file: 'yes_im_a_mess.mp3',
      timingKey: 'YIAMSongTiming',
      difficulty: 'Medium'
    },
    {
      id: 'teeth',
      title: 'Teeth',
      artist: '5 Seconds of Summer',
      cover: teethCover,
      file: 'teeth.mp3',
      timingKey: 'TeethSongTiming',
      difficulty: 'Hard'
    }
  ];

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  const handleStartGame = () => {
    if (selectedSong) {
      onSongSelect(selectedSong);
    }
  };

  return (
    <div className="song-selection-container">
      {/* <h1 className="selection-title">Pulse</h1> */}
      <h2 className="selection-subtitle">
        {selectedSong ? `"${selectedSong.title}" Selected` : 'Select a Song'}
      </h2>
      
      <div className="songs-grid">
        {songs.map((song) => (
          <div 
            key={song.id}
            className={`song-card ${selectedSong === song ? 'selected' : ''}`}
            onClick={() => handleSongSelect(song)}
            onMouseEnter={() => setHover(song.id)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="song-cover">
              <img src={song.cover} alt={`${song.title} cover`} />
              {(hover === song.id || selectedSong === song) && (
                <div className="play-overlay">
                  <span className="play-icon">▶</span>
                </div>
              )}
            </div>
            <div className="song-info">
              <h3 className="song-title">{song.title}</h3>
              <p className="song-artist">{song.artist}</p>
              <span className={`song-difficulty ${song.difficulty.toLowerCase()}`}>
                {song.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button 
        className={`start-game-btn ${!selectedSong ? 'disabled' : ''}`}
        onClick={handleStartGame}
        disabled={!selectedSong}
      >
        Start Game
      </button>
    </div>
  );
};

export default SongSelection;