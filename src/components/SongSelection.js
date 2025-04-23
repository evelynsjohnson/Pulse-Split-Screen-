
import React, { useState, useEffect, useCallback } from "react";

// Cover Images
import teethCover from "../assets/songCovers/teeth_cover.jpg";
import sharksCover from "../assets/songCovers/sharks_cover.jpg";
import fyoCover from "../assets/songCovers/figure_you_out_cover.jpg";
import eotrCover from "../assets/songCovers/end_of_the_road_cover.jpg";
import bangCover from "../assets/songCovers/bang_bang_cover.jpg";
import parisCover from "../assets/songCovers/paris_cover.jpg";
import soyCover from "../assets/songCovers/shape_of_you_cover.jpg";
import yiamCover from "../assets/songCovers/yes_im_a_mess_cover.jpg";
import gladiatorCover from "../assets/songCovers/gladiator_cover.jpg";
import insaneCover from "../assets/songCovers/insane_cover.jpg";
import lifefCover from "../assets/songCovers/life_force_cover.jpg";
import stargazingCover from "../assets/songCovers/stargazing_cover.jpg";
import strCover from "../assets/songCovers/something_to_remember_cover.jpg";
import bleedCover from "../assets/songCovers/bleed_cover.jpg";
import gokCover from "../assets/songCovers/god_only_knows_cover.jpg";
import fgCover from "../assets/songCovers/feeling_good_cover.jpg";

// MP3s
import teethMp3 from "../assets/mp3Files/teeth.mp3";
import sharksMp3 from "../assets/mp3Files/sharks.mp3";
import fyoMp3 from "../assets/mp3Files/figure_you_out.mp3";
import eotrMp3 from "../assets/mp3Files/end_of_the_road.mp3";
import bangMp3 from "../assets/mp3Files/bang_bang.mp3";
import parisMp3 from "../assets/mp3Files/paris.mp3";
import soyMp3 from "../assets/mp3Files/shape_of_you.mp3";
import yiamMp3 from "../assets/mp3Files/yes_im_a_mess.mp3";
import lifefMp3 from "../assets/mp3Files/life_force.mp3";
import insaneMp3 from "../assets/mp3Files/insane.mp3";
import gladiatorMp3 from "../assets/mp3Files/gladiator.mp3";
import stargazingMp3 from "../assets/mp3Files/stargazing.mp3";
import strMp3 from "../assets/mp3Files/something_to_remember.mp3";
// import bleedMp3 from "../assets/mp3Files/bleed.mp3";
// import gokMp3 from "../assets/mp3Files/god_only_knows.mp3";
// import fgMp3 from "../assets/mp3Files/feeling_good.mp3";

const SongSelection = ({ onSongSelect }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(null);
  const [visibleIndices, setVisibleIndices] = useState([]);

  const songs = [
    { id: "str", title: "Something to Remember [**Special]", artist: "Matt Hansen", cover: strCover, file: strMp3, timingKey: "STRSongTiming", rating: 5 },
    { id: "paris", title: "Paris", artist: "The Chainsmokers", cover: parisCover, file: parisMp3, timingKey: "ParisSongTiming", rating: 3},
    { id: "starg", title: "Stargazing", artist: "Myles Smith", cover: stargazingCover, file: stargazingMp3, timingKey: "StargazingSongTiming", rating: 3.5 },
    { id: "gladi", title: "Gladiator", artist: "Jann", cover: gladiatorCover, file: gladiatorMp3, timingKey: "GladiatorSongTiming", rating: 6 },
    { id: "teeth", title: "Teeth", artist: "5 Seconds of Summer", cover: teethCover, file: teethMp3, timingKey: "TeethSongTiming", rating: 6.5 },
    { id: "fyo", title: "Figure You Out", artist: "BB Cooper", cover: fyoCover, file: fyoMp3, timingKey: "FYOSongTiming", rating: 7.0 },
    { id: "sharks", title: "Sharks", artist: "Imagine Dragons", cover: sharksCover, file: sharksMp3, timingKey: "SharksSongTiming", rating: 7.0 },
    { id: "lifef", title: "Life Force [No Lyrics]", artist: "ptasinski, RJ Pasin", cover: lifefCover, file: lifefMp3, timingKey: "LifeForceSongTiming", rating: 7.5 },
    { id: "eotr", title: "End of the Road", artist: "Layto", cover: eotrCover, file: eotrMp3, timingKey: "EOTRSongTiming", rating: 8 },
    { id: "insane", title: "Insane", artist: "Black Gryph0n, Baasik", cover: insaneCover, file: insaneMp3, timingKey: "InsaneSongTiming", rating: 8.5 },
    { id: "bang", title: "Bang Bang", artist: "Ariana Grande, Jessie J, and Nicki Minaj", cover: bangCover, file: bangMp3, timingKey: "BangSongTiming", rating: 8.0 },
    { id: "soy", title: "Shape of You [Unrevised]", artist: "Ed Sheeran", cover: soyCover, file: soyMp3, timingKey: "SOYSongTiming", rating: 1000.0 },
    { id: "yiam", title: "Yes I'm a Mess [Unrevised]", artist: "AJR", cover: yiamCover, file: yiamMp3, timingKey: "YIAMSongTiming", rating: 1000.0 },
  ];

  /*
    { id: "", title: "", artist: "", cover: Cover, file: Mp3, timingKey: "SongTiming", rating:  },
  */

  const totalSongs = songs.length;
  const getRatingClass = (rating) => {
    if (rating <= 2) return 'rating-1';
    if (rating <= 4) return 'rating-2';
    if (rating <= 6) return 'rating-3';
    if (rating <= 8) return 'rating-4';
    return 'rating-5'; // Rating > 8
  };

  const handleSongSelect = useCallback((song) => {
    console.log("Song selected:", song.title);
    onSongSelect(song);
  }, [onSongSelect]);

  const getCarouselIndices = useCallback((centerIndex, includeOffscreen = false) => {
    const indices = [];
    const range = includeOffscreen ? 3 : 2;

    for (let i = -range; i <= range; i++) {
      indices.push((centerIndex + i + totalSongs) % totalSongs);
    }
    return indices;
  }, [totalSongs]);

  useEffect(() => {
    setVisibleIndices(getCarouselIndices(focusedIndex, true));
  }, [getCarouselIndices, focusedIndex]);

  const navigateCarousel = useCallback((navDirection) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setDirection(navDirection);

    const currentIndex = focusedIndex;
    const newIndex = navDirection === 'left'
      ? (currentIndex - 1 + totalSongs) % totalSongs
      : (currentIndex + 1) % totalSongs;

    setVisibleIndices(getCarouselIndices(newIndex, true));
    setFocusedIndex(newIndex);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, focusedIndex, totalSongs, getCarouselIndices]);

  const handleRandomSong = useCallback(() => {
    if (isTransitioning) return;
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * totalSongs);
    } while (randomIndex === focusedIndex && totalSongs > 1);

    const directDistance = Math.abs(randomIndex - focusedIndex);
    const wrapDistance = totalSongs - directDistance;
    let moveDirection;

    if (directDistance <= wrapDistance) {
      moveDirection = randomIndex > focusedIndex ? 'right' : 'left';
    } else { moveDirection = randomIndex > focusedIndex ? 'left' : 'right'; }

    setIsTransitioning(true);
    setDirection(moveDirection);
    setVisibleIndices(getCarouselIndices(randomIndex, true));
    setFocusedIndex(randomIndex);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [focusedIndex, totalSongs, isTransitioning, getCarouselIndices]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (["arrowleft", "a"].includes(key)) {
        navigateCarousel('left');
      } else if (["arrowright", "d"].includes(key)) {
        navigateCarousel('right');
      } else if (["enter", "*", "q", "1"].includes(key)) { // Use Enter or '*' to select
        handleSongSelect(songs[focusedIndex]);
      } else if (["e", "2", "ó"].includes(key)) { // Random song with E, 2, or ó
        handleRandomSong();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, songs, handleSongSelect, navigateCarousel, handleRandomSong]);

  const getPositionClass = useCallback((itemIndex, centerIndex) => {
    const directDist = Math.abs(itemIndex - centerIndex);
    const wrapDist = totalSongs - directDist;
    const shortestDist = Math.min(directDist, wrapDist);

    let positionClass;
    if (shortestDist === 0) {
      return 'center';
    } else if (
      (itemIndex < centerIndex && directDist <= wrapDist) ||
      (itemIndex > centerIndex && directDist > wrapDist)
    ) {
      positionClass = `left-${shortestDist}`;
    } else {
      positionClass = `right-${shortestDist}`;
    }

    if (shortestDist <= 3) return positionClass;
    return 'hidden-item';
  }, [totalSongs]);

  const getTransitionClass = useCallback((itemIndex, centerIndex) => {
    if (!direction || !isTransitioning) return '';

    const oldPositionClass = getPositionClass(itemIndex, direction === 'left' ?
      (centerIndex + 1) % totalSongs :
      (centerIndex - 1 + totalSongs) % totalSongs
    );

    const newPositionClass = getPositionClass(itemIndex, centerIndex);

    if (oldPositionClass === 'hidden-item' && (newPositionClass === 'left-3' || newPositionClass === 'right-3')) {
      return direction === 'left' ? 'entering-right' : 'entering-left';
    }

    if (newPositionClass === 'hidden-item' && (oldPositionClass === 'left-3' || oldPositionClass === 'right-3')) {
      return direction === 'left' ? 'exiting-left' : 'exiting-right';
    }

    return '';
  }, [direction, isTransitioning, getPositionClass, totalSongs]);


  const focusedSong = songs[focusedIndex];

  return (
    <>
      <div className="song-selection-wrapper">
        {/* Player 1 Selection */}
        <div className="song-selection-container">
          <div className="player-label">Player 1</div>
          <p className="selection-instruction">Use ←/→ keys to select a song. <br></br>Songs increase in difficulty panning to the right.</p>

          <button className="random-song-button" onClick={handleRandomSong}>
            Press ó for a random song.<br></br>Press * to start the game.
            <span className="button-glow"></span>
          </button>

          <div className="song-carousel-viewport">
            <div className="song-carousel-container">
              {visibleIndices.map((index) => {
                const song = songs[index];
                const positionClass = getPositionClass(index, focusedIndex);
                const transitionClass = getTransitionClass(index, focusedIndex);

                return (
                  <div
                    key={`p1-carousel-${song.id}-${index}`}
                    className={`carousel-item ${positionClass} ${transitionClass} ${isTransitioning ? 'transitioning' : ''}`}
                  >
                    <div className="cover-wrapper">
                      <img src={song.cover} alt={`${song.title} cover`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="selected-song-details">
            <h3 className="selected-song-title">{focusedSong.title}</h3>
            <p className="selected-song-artist">{focusedSong.artist}</p>
            <div className={`song-rating ${getRatingClass(focusedSong.rating)}`}>
              Difficulty: {focusedSong.rating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Player 2 Selection*/}
        <div className="song-selection-container">
          <div className="player-label">Player 2</div>
          <p className="selection-instruction">Use ←/→ keys to select a song. Press * to start.</p>

          <button className="random-song-button" onClick={handleRandomSong}>
            Press ó for a random song.
            <span className="button-glow"></span>
          </button>

          <div className="song-carousel-viewport">
            <div className="song-carousel-container">
              {visibleIndices.map((index) => {
                const song = songs[index];
                const positionClass = getPositionClass(index, focusedIndex);
                const transitionClass = getTransitionClass(index, focusedIndex);

                return (
                  <div
                    key={`p2-carousel-${song.id}-${index}`}
                    className={`carousel-item ${positionClass} ${transitionClass} ${isTransitioning ? 'transitioning' : ''}`}
                  >
                    <div className="cover-wrapper">
                      <img src={song.cover} alt={`${song.title} cover`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="selected-song-details">
            <h3 className="selected-song-title">{focusedSong.title}</h3>
            <p className="selected-song-artist">{focusedSong.artist}</p>
            <div className={`song-rating ${getRatingClass(focusedSong.rating)}`}>
              Difficulty: {focusedSong.rating.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --primary: #6c5ce7;
          --primary-light: #a29bfe;
          --primary-dark: #5548c5;
          --secondary: #ff7675;
          --secondary-light: #ff85a2;
          --secondary-dark: #e05c5c;
          --accent: #00cec9;
          --background: #f8f9fa;
          --card-bg: rgba(255, 255, 255, 0.92);
          --text-dark: #343a40;
          --text-light: #f8f9fa;
          --border-light: rgba(0, 0, 0, 0.08);
        }

        body {
          font-family: 'Poppins', 'Segoe UI', sans-serif;
          background: var(--background);
          color: var(--text-dark);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          overflow-x: hidden;
        }

        .song-selection-wrapper {
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 1000px;
          width: 100%;
          max-width: 1800px;
          padding: 30px 20px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .song-selection-container {
          flex: 1;
          min-width: 800px;
          max-width: 800px;
          background: var(--card-bg);
          border-radius: 20px;
          padding: 30px 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
          border: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          backdrop-filter: blur(10px);
          transition: transform 0.8s ease, box-shadow 0.3s ease;
        }
        
        .song-selection-container:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.09);
        }

        .player-label {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 10px;
          position: relative;
          display: inline-block;
        }
        
        .player-label::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 3px;
          background: linear-gradient(to right, var(--primary), var(--primary-light));
          border-radius: 2px;
        }

        .selection-instruction {
          font-size: 0.95rem;
          color: #666;
          margin-bottom: 5px;
          min-height: 1.5em;
          opacity: 0.9;
        }

        /* Random Song Button Styling */
        .random-song-button {
          position: relative;
          margin: 8px 0 15px;
          padding: 8px 18px;
          background: linear-gradient(135deg, var(--accent), var(--primary-light));
          border: none;
          border-radius: 20px;
          color: var(--text-light);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }

        .random-song-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
        }

        .random-song-button:active {
          transform: translateY(1px);
        }
        .song-carousel-viewport {
          width: 80%;
          height: 230px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
          margin-bottom: 25px;
          perspective: 1200px;
        }

        .song-carousel-container {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }

        .cover-wrapper {
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.25s ease;
        }

        .carousel-item {
          width: 160px;
          height: 160px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.6);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.33, 1, 0.68, 1);
          opacity: 0;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          will-change: transform, opacity;
        }
        
        .carousel-item.transitioning {
          transition: all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .carousel-item img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .carousel-item.center .cover-wrapper:hover {
          transform: scale(1.05);
        }

        .carousel-item.center {
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 1;
          z-index: 5;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
        }

        .carousel-item.left-1 {
          transform: translate(-135%, -50%) scale(0.85);
          opacity: 0.8;
          z-index: 4;
          filter: brightness(0.9);
        }

        .carousel-item.right-1 {
          transform: translate(35%, -50%) scale(0.85);
          opacity: 0.8;
          z-index: 4;
          filter: brightness(0.9);
        }

        .carousel-item.left-2 {
          transform: translate(-210%, -50%) scale(0.65);
          opacity: 0.5;
          z-index: 3;
          filter: brightness(0.8);
        }

        .carousel-item.right-2 {
          transform: translate(110%, -50%) scale(0.65);
          opacity: 0.5;
          z-index: 3;
          filter: brightness(0.8);
        }
        
        .carousel-item.left-3 {
          transform: translate(-280%, -50%) scale(0.5);
          opacity: 0.2;
          z-index: 2;
          filter: brightness(0.7);
        }
        
        .carousel-item.right-3 {
          transform: translate(180%, -50%) scale(0.5);
          opacity: 0.2;
          z-index: 2;
          filter: brightness(0.7);
        }
        
        .carousel-item.hidden-item {
          opacity: 0;
          z-index: 0;
          transform: translate(-50%, -50%) scale(0.4);
        }
        
        /* New slide-in animation classes */
        .carousel-item.entering-left {
          transform: translate(-350%, -50%) scale(0.4);
          opacity: 0;
        }
        
        .carousel-item.entering-right {
          transform: translate(250%, -50%) scale(0.4);
          opacity: 0;
        }
        
        .carousel-item.exiting-left {
          transform: translate(-350%, -50%) scale(0.4);
          opacity: 0;
        }
        
        .carousel-item.exiting-right {
          transform: translate(250%, -50%) scale(0.4);
          opacity: 0;
        }

        .selected-song-details {
          margin-top: 15px;
          width: 100%;
          padding: 0 15px;
          min-height: 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: opacity 0.3s ease;
        }

        .selected-song-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-top: -70px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
          transition: all 0.3s ease;
        }

        .selected-song-artist {
          font-size: 1.1rem;
          color: #555;
          margin-top: -15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
          opacity: 0.85;
          transition: all 0.3s ease;
        }

        .song-rating {
          padding: 7px 18px;
          border-radius: 20px;
          margin-bottom: 25px;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
          display: inline-block;
          transition: all 0.3s ease;
        }

        .song-rating.rating-1 { 
          background: linear-gradient(135deg, #4CAF50, #2E7D32); 
        }
        .song-rating.rating-2 { 
          background: linear-gradient(135deg, #8BC34A, #558B2F); 
        }
        .song-rating.rating-3 { 
          background: linear-gradient(135deg, #FFC107, #FF8F00); 
        }
        .song-rating.rating-4 { 
          background: linear-gradient(135deg, #FF9800, #E65100); 
        }
        .song-rating.rating-5 { 
          background: linear-gradient(135deg, #F44336, #C62828); 
        }

        /* Responsive adjustments */
        @media (max-width: 1100px) {
          .song-selection-wrapper {
            flex-direction: column;
            align-items: center;
            gap: 40px;
          }
          
          .song-selection-container {
            min-width: 90%;
            max-width: 550px;
            padding: 25px 20px;
          }
          
          .random-song-button {
            font-size: 0.85rem;
            padding: 7px 16px;
          }
        }

        @media (max-width: 600px) {
          .carousel-item {
            width: 130px;
            height: 130px;
          }
          
          .song-carousel-viewport {
            height: 200px;
          }
          
          .carousel-item.center {
            transform: translate(-50%, -50%) scale(1.1);
          }
          
          .selected-song-title {
            font-size: 1.3rem;
          }
          
          .selected-song-artist {
            font-size: 0.95rem;
          }
          
          .song-rating {
            font-size: 0.85rem;
            padding: 6px 15px;
          }
          
          .random-song-button {
            font-size: 0.8rem;
            padding: 6px 14px;
          }
        }
      `}</style>
    </>
  );
};

export default SongSelection;