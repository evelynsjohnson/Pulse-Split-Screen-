import React, { useState, useEffect, useRef } from 'react';
import Arrow from './Arrow';
import { YIAMSongTiming, SOYSongTiming, TeethSongTiming } from '../songTiming';

import upArrow from '../assets/upArrow.png';
import downArrow from '../assets/downArrow.png';
import leftArrow from '../assets/leftArrow.png';
import rightArrow from '../assets/rightArrow.png';

const Game = ({ songFile, songTimingKey, onBackToSelection }) => {
  const [arrows, setArrows] = useState([]);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [player1Ready, setPlayer1Ready] = useState(false);
  const [player2Ready, setPlayer2Ready] = useState(false);
  const [gameState, setGameState] = useState('waiting'); // 'waiting', 'playing', 'ended'
  const [player1Combo, setPlayer1Combo] = useState(0);
  const [player2Combo, setPlayer2Combo] = useState(0);
  const [player1MaxCombo, setPlayer1MaxCombo] = useState(0); // Track maximum combo for player 1
  const [player2MaxCombo, setPlayer2MaxCombo] = useState(0); // Track maximum combo for player 2

  const startTime = useRef(null);
  const arrowIndex = useRef(0);
  const audioRef = useRef(null);
  const hitWindow = 150; // Allow generous hit timing in milliseconds
  const removeDelay = 2000; // Matches arrow fall animation duration
  const arrowFallDuration = 2000; // Time it takes for an arrow to fall (matches CSS animation)

  // Get the appropriate song timing based on the prop
  const getSongTiming = () => {
    switch (songTimingKey) {
      case 'YIAMSongTiming':
        return YIAMSongTiming;
      case 'SOYSongTiming':
        return SOYSongTiming;
      case 'TeethSongTiming':
        return TeethSongTiming;
      default:
        return YIAMSongTiming; // Default fallback
    }
  };

  const songTiming = getSongTiming();
  const directions = ['left', 'up', 'right', 'down'];

  // Ready up logic
  useEffect(() => {
    const handleReadyKeyPress = (e) => {
      if (gameState !== 'waiting') return;

      const key = e.key.toLowerCase();

      // Check if Player 1 pressed one of their keys (WASD)
      if (['w', 'a', 's', 'd'].includes(key) && !player1Ready) {
        setPlayer1Ready(true);
      }

      // Check if Player 2 pressed one of their arrow keys
      if (['arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key) ||
        ['up', 'left', 'down', 'right'].includes(e.code.toLowerCase().replace('arrow', ''))) {
        setPlayer2Ready(true);
      }
    };

    window.addEventListener('keydown', handleReadyKeyPress);
    return () => window.removeEventListener('keydown', handleReadyKeyPress);
  }, [gameState, player1Ready, player2Ready]);

  // Handle game start (without countdown)
  useEffect(() => {
    // If both players are ready, start game immediately
    if (player1Ready && player2Ready && gameState === 'waiting') {
      // Initialize audio
      audioRef.current = new Audio(require(`../assets/${songFile}`));

      // Small timeout to give visual feedback that both players are ready
      setTimeout(() => {
        setGameState('playing');

        // Configure start time and audio settings based on the selected song
        if (songTimingKey === 'YIAMSongTiming') {
          // For "Yes I'm a Mess"
          startTime.current = Date.now() + 800; // Offset to sync with song timing
          audioRef.current.volume = 0.5;
          audioRef.current.currentTime = 2; // Start at 2 seconds
        } else if (songTimingKey === 'SOYSongTiming') {
          // For "Shape of You"
          startTime.current = Date.now() - 500; // No offset
          audioRef.current.volume = 0.5;
          audioRef.current.currentTime = 0; // Start at the beginning
        }
        else if (songTimingKey === 'TeethSongTiming') {
          // For "Teeth"
          startTime.current = Date.now() - 1250; // No offset
          audioRef.current.volume = 0.5;
          audioRef.current.currentTime = 0; // Start at the beginning
        }
        // Play the audio
        audioRef.current.play();
      }, 500); // Small delay for visual feedback
    }
  }, [player1Ready, player2Ready, gameState, songFile, songTimingKey]);

  // Arrow generation and game logic
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      const currentTime = Date.now() - startTime.current;

      // Spawn new arrows based on song timing
      while (
        arrowIndex.current < songTiming.length &&
        songTiming[arrowIndex.current].time <= currentTime
      ) {
        const player1Direction = directions[Math.floor(Math.random() * directions.length)];
        const player2Direction = directions[Math.floor(Math.random() * directions.length)];

        setArrows((prevArrows) => [
          ...prevArrows,
          {
            id: `${arrowIndex.current}-p1`,
            spawnTime: currentTime,
            targetTime: currentTime + arrowFallDuration,
            direction: player1Direction,
            player: 'player1',
            hit: false,
            missed: false,
          },
          {
            id: `${arrowIndex.current}-p2`,
            spawnTime: currentTime,
            targetTime: currentTime + arrowFallDuration,
            direction: player2Direction,
            player: 'player2',
            hit: false,
            missed: false,
          },
        ]);

        arrowIndex.current++;
      }

      // Mark arrows as missed if they've passed the target time
      setArrows((prevArrows) => {
        let anyMissedP1 = false;
        let anyMissedP2 = false;
        
        const updatedArrows = prevArrows.map(arrow => {
          if (!arrow.hit && !arrow.missed && currentTime > arrow.targetTime + hitWindow) {
            // Track if any arrows were missed by player
            if (arrow.player === 'player1') {
              anyMissedP1 = true;
            } else {
              anyMissedP2 = true;
            }
            return { ...arrow, missed: true };
          }
          return arrow;
        });
        
        // Reset combo counter outside the map to avoid multiple state updates
        if (anyMissedP1) {
          setPlayer1Combo(0);
        }
        
        if (anyMissedP2) {
          setPlayer2Combo(0);
        }
        
        return updatedArrows;
      });

      // Remove arrows that have been on screen too long
      setArrows((prevArrows) =>
        prevArrows.filter((arrow) => currentTime - arrow.spawnTime < removeDelay)
      );

      // Check if song has ended
      if (audioRef.current && audioRef.current.ended) {
        setGameState('ended');
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [gameState, songTiming]);

  // Key press handler for gameplay
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      const player = ['w', 'a', 's', 'd'].includes(key) ? 'player1' : 'player2';
      const directionMap = {
        a: 'left',
        w: 'up',
        d: 'right',
        s: 'down',
        arrowleft: 'left',
        arrowup: 'up',
        arrowright: 'right',
        arrowdown: 'down',
      };

      const direction = directionMap[key] || directionMap[e.code.toLowerCase().replace('arrow', '')];
      if (!direction) return;

      const currentTime = Date.now() - startTime.current;

      setArrows((prevArrows) => {
        let arrowHit = false;
        let hitQuality = 0; // 0: miss, 1: ok, 2: good, 3: perfect

        // Find the closest arrow for this direction and player
        const arrowsForPlayerDirection = prevArrows.filter(
          arrow => arrow.player === player &&
            arrow.direction === direction &&
            !arrow.hit &&
            !arrow.missed
        );

        // Sort by how close they are to their target time
        arrowsForPlayerDirection.sort((a, b) =>
          Math.abs(currentTime - a.targetTime) - Math.abs(currentTime - b.targetTime)
        );

        // Check if we have an arrow to hit
        if (arrowsForPlayerDirection.length > 0) {
          const closestArrow = arrowsForPlayerDirection[0];
          const timeDifference = Math.abs(currentTime - closestArrow.targetTime);

          if (timeDifference <= hitWindow) {
            arrowHit = true;

            // Determine hit quality - Modified scoring
            if (timeDifference <= hitWindow / 4) {
              hitQuality = 3; // Perfect
            } else if (timeDifference <= hitWindow / 2) {
              hitQuality = 2; // Good
            } else {
              hitQuality = 1; // Ok
            }
          }
        }

        // Update arrows
        const updatedArrows = prevArrows.map(arrow => {
          if (arrowHit &&
            arrow === arrowsForPlayerDirection[0]) {
            return { ...arrow, hit: true, hitQuality };
          }
          return arrow;
        });

        // Update hit feedback and score with new scoring system
        if (arrowHit) {
          // Update score based on hit quality - Modified scores
          let baseScore = 0;
          switch (hitQuality) {
            case 3: // Perfect
              baseScore = 150;
              break;
            case 2: // Good
              baseScore = 100;
              break;
            case 1: // Ok
              baseScore = 50;
              break;
            default:
              baseScore = 0;
          }

          if (player === 'player1') {
            // Update the player1 combo first
            setPlayer1Combo(prevCombo => {
              const newCombo = prevCombo + .5;
              // Update max combo
              if (newCombo > player1MaxCombo) {
                setPlayer1MaxCombo(newCombo);
              }
              
              // Calculate score with the new combo value
              const totalScore = Math.round(baseScore * (1 + newCombo / 100));
              setPlayer1Score(prev => prev + totalScore);
              
              return newCombo;
            });
          } else {
            // Update the player2 combo first
            setPlayer2Combo(prevCombo => {
              const newCombo = prevCombo + .5;
              // Update max combo
              if (newCombo > player2MaxCombo) {
                setPlayer2MaxCombo(newCombo);
              }
              
              // Calculate score with the new combo value
              const totalScore = Math.round(baseScore * (1 + newCombo / 100));
              setPlayer2Score(prev => prev + totalScore);
              
              return newCombo;
            });
          }
        } else {
          // If no arrow was hit, it's a miss
          // Reset combo on miss
          if (player === 'player1') {
            setPlayer1Combo(0);
          } else {
            setPlayer2Combo(0);
          }
        }

        return updatedArrows;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, player1MaxCombo, player2MaxCombo]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Helper function to get the appropriate image
  const getArrowImage = (direction) => {
    switch (direction) {
      case 'left': return leftArrow;
      case 'up': return upArrow;
      case 'right': return rightArrow;
      case 'down': return downArrow;
      default: return null;
    }
  };

  // Handle returning to song selection
  const handleReturn = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onBackToSelection();
  };

  // Render the appropriate game state
  const renderGameContent = () => {
    if (gameState === 'waiting') {
      return (
        <div className="ready-screen">
          <div className={`ready-prompt ${player1Ready ? 'ready' : ''}`}>
            Player 1, press any key (WASD) to ready up.
            {player1Ready && <div className="ready-check">✓</div>}
          </div>
          <div className={`ready-prompt ${player2Ready ? 'ready' : ''}`}>
            Player 2, press any key (←↑→↓) to ready up.
            {player2Ready && <div className="ready-check">✓</div>}
          </div>
          <button className="back-button" onClick={handleReturn}>
            Back to Songs
          </button>
        </div>
      );
    } else if (gameState === 'ended') {
      return (
        <div className="game-ended">
          <h2>Game Over!</h2>
          <div className="final-scores">
            <div className="final-player-score">
              <h3>Player 1</h3>
              <div className="final-score">{player1Score}</div>
              <div className="final-combo">Max Combo: {player1MaxCombo}</div>
            </div>
            <div className="final-player-score">
              <h3>Player 2</h3>
              <div className="final-score">{player2Score}</div>
              <div className="final-combo">Max Combo: {player2MaxCombo}</div>
            </div>
          </div>
          <div className="winner">
            {player1Score > player2Score
              ? 'Player 1 Wins!'
              : player2Score > player1Score
                ? 'Player 2 Wins!'
                : 'It\'s a Tie!'}
          </div>
          <button className="play-again-button" onClick={handleReturn}>
            Back to Song Selection
          </button>
        </div>
      );
    } else {
      // Main gameplay UI
      return (
        <>
          <div className="lanes">
            <div className="player-section">
              <div className="player-header">Player 1</div>
              <div className="player-lanes player1">
                {directions.map((direction) => (
                  <div key={`player1-${direction}`} className={`lane ${direction}`}>
                    <div className="static-arrow">
                      <img src={getArrowImage(direction)} alt={direction} />
                    </div>
                    {arrows
                      .filter((arrow) => arrow.player === 'player1' && arrow.direction === direction && !arrow.hit)
                      .map((arrow) => (
                        <Arrow
                          key={arrow.id}
                          direction={arrow.direction}
                          player={arrow.player}
                          missed={arrow.missed}
                        />
                      ))}
                  </div>
                ))}
              </div>
              <div className="score-container">
                <div className="score-box">{player1Score}</div>
                <div className="combo-display">
                  Combo x{player1Combo}
                </div>
              </div>
              <div className="controls-guide player1-controls">
                <span className="key">W</span> <span className="key">A</span> <span className="key">S</span> <span className="key">D</span>
              </div>
            </div>
            <div className="player-section">
              <div className="player-header">Player 2</div>
              <div className="player-lanes player2">
                {directions.map((direction) => (
                  <div key={`player2-${direction}`} className={`lane ${direction}`}>
                    <div className="static-arrow">
                      <img src={getArrowImage(direction)} alt={direction} />
                    </div>
                    {arrows
                      .filter((arrow) => arrow.player === 'player2' && arrow.direction === direction && !arrow.hit)
                      .map((arrow) => (
                        <Arrow
                          key={arrow.id}
                          direction={arrow.direction}
                          player={arrow.player}
                          missed={arrow.missed}
                        />
                      ))}
                  </div>
                ))}
              </div>
              <div className="score-container">
                <div className="score-box">{player2Score}</div>
                <div className="combo-display">
                  Combo x{player2Combo}
                </div>
              </div>
              <div className="controls-guide player2-controls">
                <span className="key">↑</span> <span className="key">←</span> <span className="key">↓</span> <span className="key">→</span>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="game-container">
      <div className="game">
        <h1 className="game-title">Pulse</h1>
        {renderGameContent()}
      </div>
    </div>
  );
};

export default Game;