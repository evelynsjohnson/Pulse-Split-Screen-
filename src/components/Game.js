import React, { useState, useEffect, useRef } from 'react';
import Arrow from './Arrow';
import upArrow from '../assets/upArrow.png';
import downArrow from '../assets/downArrow.png';
import leftArrow from '../assets/leftArrow.png';
import rightArrow from '../assets/rightArrow.png';

import upPurpleArrow from '../assets/upPurpleArrow.png';
import downPurpleArrow from '../assets/downPurpleArrow.png';
import leftPurpleArrow from '../assets/leftPurpleArrow.png';
import rightPurpleArrow from '../assets/rightPurpleArrow.png';


import {
  YIAMSongTiming, SOYSongTiming, TeethSongTiming, FYOSongTiming, SharksSongTiming,
  EOTRSongTiming, BangSongTiming, ParisSongTiming, LifeForceSongTiming, GladiatorSongTiming,
  StargazingSongTiming, InsaneSongTiming, GOKSongTiming, BleedSongTiming, FGSongTiming,
  STRSongTiming
} from '../songTiming';

const Game = ({ songFile, songTimingKey, onBackToSelection }) => {
  const [arrows, setArrows] = useState([]);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [player1Ready, setPlayer1Ready] = useState(false);
  const [player2Ready, setPlayer2Ready] = useState(false);
  const [player1ReadyToGoBack, setPlayer1ReadyToGoBack] = useState(false);
  const [player2ReadyToGoBack, setPlayer2ReadyToGoBack] = useState(false);
  const [gameState, setGameState] = useState('waiting'); // 'waiting', 'playing', 'ended'
  const [player1Combo, setPlayer1Combo] = useState(0);
  const [player2Combo, setPlayer2Combo] = useState(0);
  const [player1MaxCombo, setPlayer1MaxCombo] = useState(0);
  const [player2MaxCombo, setPlayer2MaxCombo] = useState(0);
  const [player1Indicator, setPlayer1Indicator] = useState({ show: false, type: '', timestamp: 0 });
  const [player2Indicator, setPlayer2Indicator] = useState({ show: false, type: '', timestamp: 0 });

  const startTime = useRef(null);
  const arrowIndex = useRef(0);
  const audioRef = useRef(null);
  const hitWindow = 200;
  const removeDelay = 2000;
  const arrowFallDuration = 2000;
  const [player1Stats, setPlayer1Stats] = useState({
    arrowsHit: 0,
    totalArrows: 0,
    perfectHits: 0,
    goodHits: 0,
    okHits: 0,
    misses: 0
  });
  const [player2Stats, setPlayer2Stats] = useState({
    arrowsHit: 0,
    totalArrows: 0,
    perfectHits: 0,
    goodHits: 0,
    okHits: 0,
    misses: 0
  });

  // Track key presses for anti-spam
  const player1KeyPresses = useRef([]);
  const player2KeyPresses = useRef([]);
  const spamThreshold = 8; // Max key presses allowed in spamWindow
  const spamWindow = 1000; // Time window in ms to check for spamming

  const getSongTiming = () => {
    switch (songTimingKey) {
      case 'YIAMSongTiming': return YIAMSongTiming;
      case 'SOYSongTiming': return SOYSongTiming;
      case 'TeethSongTiming': return TeethSongTiming;
      case 'FYOSongTiming': return FYOSongTiming;
      case 'SharksSongTiming': return SharksSongTiming;
      case 'EOTRSongTiming': return EOTRSongTiming;
      case 'BangSongTiming': return BangSongTiming;
      case 'ParisSongTiming': return ParisSongTiming;
      case 'LifeForceSongTiming': return LifeForceSongTiming;
      case 'InsaneSongTiming': return InsaneSongTiming;
      case 'StargazingSongTiming': return StargazingSongTiming;
      case 'GladiatorSongTiming': return GladiatorSongTiming;
      case 'STRSongTiming': return STRSongTiming;
      case 'GOKSongTiming': return GOKSongTiming;
      case 'FGSongTiming': return FGSongTiming;
      case 'BleedSongTiming': return BleedSongTiming;
      default: return YIAMSongTiming;
    }
  };

  const songTiming = getSongTiming();
  const directions = ['left', 'up', 'right', 'down'];

  const showIndicator = (player, type) => {
    const simplifiedType = type === 'miss' ? 'miss' : 'hit';
    
    if (player === 'player1') {
      setPlayer2Indicator({ show: true, type: simplifiedType, timestamp: Date.now() });
    } else {
      setPlayer1Indicator({ show: true, type: simplifiedType, timestamp: Date.now() });
    }
  };

  // Effect to hide indicators after a delay
  useEffect(() => {
    if (player1Indicator.show) {
      const timer = setTimeout(() => {
        setPlayer1Indicator({ show: false, type: '', timestamp: 0 });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [player1Indicator.timestamp]);

  useEffect(() => {
    if (player2Indicator.show) {
      const timer = setTimeout(() => {
        setPlayer2Indicator({ show: false, type: '', timestamp: 0 });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [player2Indicator.timestamp]);

  // Ready up logic
  useEffect(() => {
    const handleReadyKeyPress = (e) => {
      if (gameState !== 'waiting') return;
      const key = e.key.toLowerCase();
      if (key === '*' || key === 'q' || key === '1') {
        handleReturn();
        return;
      }
      if (['w', 'a', 's', 'd'].includes(key)) setPlayer1Ready(true);
      if (['arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key) ||
        ['up', 'left', 'down', 'right'].includes(e.code.toLowerCase().replace('arrow', ''))) {
        setPlayer2Ready(true);
      }
    };
    window.addEventListener('keydown', handleReadyKeyPress);
    return () => window.removeEventListener('keydown', handleReadyKeyPress);
  }, [gameState, player1Ready, player2Ready]);

  // Handle end screen key presses
  useEffect(() => {
    const handleEndScreenKeyPress = (e) => {
      if (gameState !== 'ended') return;
      const key = e.key.toLowerCase();
      if (key === 'q') setPlayer1ReadyToGoBack(prev => !prev);
      else if (key === '1') setPlayer2ReadyToGoBack(prev => !prev);
    };

    window.addEventListener('keydown', handleEndScreenKeyPress);
    return () => window.removeEventListener('keydown', handleEndScreenKeyPress);
  }, [gameState]);

  // Check if both players are ready to go back
  useEffect(() => {
    if (gameState === 'ended' && player1ReadyToGoBack && player2ReadyToGoBack) {
      handleReturn();
    }
  }, [player1ReadyToGoBack, player2ReadyToGoBack, gameState]);

  useEffect(() => {
    if (player1Ready && player2Ready && gameState === 'waiting') {
      audioRef.current = new Audio(songFile);
      setTimeout(() => {
        setGameState('playing');
        audioRef.current.volume = 0.5;
        audioRef.current.currentTime = 0;

        if (songTimingKey === 'YIAMSongTiming') {
          startTime.current = Date.now() - 100;
        } else if (songTimingKey === 'SOYSongTiming') {
          startTime.current = Date.now() - 1900;
        }
        else if (songTimingKey === 'TeethSongTiming') {
          startTime.current = Date.now() - 1250;
        }
        else if (songTimingKey === 'FYOSongTiming') {
          startTime.current = Date.now() - 1600;
        }
        // else if (songTimingKey === 'EOTRSongTiming') {
        //   startTime.current = Date.now() - 1800;
        // }
        else if (songTimingKey === 'SharksSongTiming') {
          startTime.current = Date.now() - 1900;
        }
        else if (songTimingKey === 'BangSongTiming') {
          startTime.current = Date.now() - 1900;
        }
        else if (songTimingKey === 'LFSongTiming') {
          startTime.current = Date.now() - 2000;
        }
        else {
          startTime.current = Date.now() - 1950;
        }
        audioRef.current.play();
      }, 500);
    }
  }, [player1Ready, player2Ready, gameState, songFile, songTimingKey]);

  // Arrow generation and game logic
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      const currentTime = Date.now() - startTime.current;
      while (
        arrowIndex.current < songTiming.length &&
        songTiming[arrowIndex.current].time <= currentTime
      ) {
        const { player } = songTiming[arrowIndex.current];
        const newArrows = [];

        if (player === "1" || player === "both") {
          const direction1 = directions[Math.floor(Math.random() * directions.length)];
          setPlayer1Stats(prev => ({ ...prev, totalArrows: prev.totalArrows + 1 }));
          newArrows.push({
            id: `${arrowIndex.current}-p1`,
            spawnTime: currentTime,
            targetTime: currentTime + arrowFallDuration,
            direction: direction1,
            player: 'player1',
            hit: false,
            missed: false,
            isBothPlayers: player === "both"
          });
        }
        if (player === "2" || player === "both") {
          const direction2 = directions[Math.floor(Math.random() * directions.length)];
          setPlayer2Stats(prev => ({ ...prev, totalArrows: prev.totalArrows + 1 }));
          newArrows.push({
            id: `${arrowIndex.current}-p2`,
            spawnTime: currentTime,
            targetTime: currentTime + arrowFallDuration,
            direction: direction2,
            player: 'player2',
            hit: false,
            missed: false,
            isBothPlayers: player === "both"
          });
        }
        setArrows((prevArrows) => [...prevArrows, ...newArrows]);
        arrowIndex.current++;
      }

      setArrows((prevArrows) => {
        const updatedArrows = prevArrows.map(arrow => {
          if (!arrow.hit && !arrow.missed && currentTime > arrow.targetTime + hitWindow) {
            if (arrow.player === 'player1') {
              setPlayer1Stats(prev => ({ ...prev, misses: prev.misses + 1 }));
              setPlayer1Combo(0);
              showIndicator('player1', 'miss');
            } else {
              setPlayer2Stats(prev => ({ ...prev, misses: prev.misses + 1 }));
              setPlayer2Combo(0);
              showIndicator('player2', 'miss');
            }
            return { ...arrow, missed: true };
          }
          return arrow;
        });
        return updatedArrows;
      });

      setArrows((prevArrows) =>
        prevArrows.filter((arrow) =>
          !arrow.hit && (!arrow.missed || currentTime - arrow.spawnTime < removeDelay * 1.5)
        )
      );

      if (audioRef.current && audioRef.current.ended) {
        setGameState('ended');
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [gameState, songTiming]);

  // Check for key spamming
  const checkForSpam = (player) => {
    const now = Date.now();
    const keyPresses = player === 'player1' ? player1KeyPresses.current : player2KeyPresses.current;

    const recentPresses = keyPresses.filter(time => now - time < spamWindow);

    if (player === 'player1') {
      player1KeyPresses.current = recentPresses;
    } else {
      player2KeyPresses.current = recentPresses;
    }

    if (recentPresses.length >= spamThreshold) {
      if (player === 'player1') {
        setPlayer1Score(prev => Math.max(0, prev - 100));
        setPlayer1Combo(0);
        showIndicator('player1', 'miss');
      } else {
        setPlayer2Score(prev => Math.max(0, prev - 100));
        setPlayer2Combo(0);
        showIndicator('player2', 'miss');
      }
      return true;
    }
    return false;
  };

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

      const now = Date.now();
      if (player === 'player1') {
        player1KeyPresses.current.push(now);
      } else {
        player2KeyPresses.current.push(now);
      }

      if (checkForSpam(player)) {
        return;
      }

      const currentTime = Date.now() - startTime.current;
      setArrows((prevArrows) => {
        let arrowHit = false;
        let hitQuality = 0;

        const arrowsForPlayerDirection = prevArrows.filter(
          arrow => arrow.player === player &&
            arrow.direction === direction &&
            !arrow.hit &&
            !arrow.missed &&
            Math.abs(currentTime - arrow.targetTime) <= hitWindow
        );

        if (arrowsForPlayerDirection.length > 0) {
          const closestArrow = arrowsForPlayerDirection[0];
          const timeDifference = Math.abs(currentTime - closestArrow.targetTime);
          arrowHit = true;
          if (timeDifference <= hitWindow / 4) {
            hitQuality = 3;
            showIndicator(player, 'perfect');
          } else if (timeDifference <= hitWindow / 2) {
            hitQuality = 2;
            showIndicator(player, 'good');
          } else {
            hitQuality = 1;
            showIndicator(player, 'ok');
          }
        } else {
          if (player === 'player1') {
            setPlayer1Combo(0);
            showIndicator(player, 'miss');
          } else {
            setPlayer2Combo(0);
            showIndicator(player, 'miss');
          }
          return prevArrows;
        }

        const updatedArrows = prevArrows.map(arrow => {
          if (arrowHit && arrow === arrowsForPlayerDirection[0]) {
            if (player === 'player1') {
              setPlayer1Stats(prev => {
                const updatedStats = { ...prev, arrowsHit: prev.arrowsHit + 1 };
                if (hitQuality === 3) updatedStats.perfectHits++;
                else if (hitQuality === 2) updatedStats.goodHits++;
                else if (hitQuality === 1) updatedStats.okHits++;
                return updatedStats;
              });
            } else {
              setPlayer2Stats(prev => {
                const updatedStats = { ...prev, arrowsHit: prev.arrowsHit + 1 };
                if (hitQuality === 3) updatedStats.perfectHits++;
                else if (hitQuality === 2) updatedStats.goodHits++;
                else if (hitQuality === 1) updatedStats.okHits++;
                return updatedStats;
              });
            }
            return { ...arrow, hit: true, hitQuality };
          }
          return arrow;
        });

        if (arrowHit) {
          let baseScore = 0;
          switch (hitQuality) {
            case 3: baseScore = 75; break;
            case 2: baseScore = 50; break;
            case 1: baseScore = 25; break;
            default: baseScore = 0;
          }

          if (player === 'player1') {
            setPlayer1Combo(prevCombo => {
              const newCombo = prevCombo + 0.5;
              if (newCombo > player1MaxCombo) setPlayer1MaxCombo(newCombo);
              const comboBonus = Math.min(newCombo / 10, 1.0);
              const totalScore = Math.round(baseScore * (1 + comboBonus));
              setPlayer1Score(prev => prev + totalScore);
              return newCombo;
            });
          } else {
            setPlayer2Combo(prevCombo => {
              const newCombo = prevCombo + 0.5;
              if (newCombo > player2MaxCombo) setPlayer2MaxCombo(newCombo);
              const comboBonus = Math.min(newCombo / 10, 1.0);
              const totalScore = Math.round(baseScore * (1 + comboBonus));
              setPlayer2Score(prev => prev + totalScore);
              return newCombo;
            });
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

  const getArrowImage = (direction) => {
    switch (direction) {
      case 'left': return leftArrow;
      case 'up': return upArrow;
      case 'right': return rightArrow;
      case 'down': return downArrow;
      default: return null;
    }
  };

  const getStaticArrowImage = (direction, player) => {
    const hasBothPlayersArrow = arrows.some(
      arrow => arrow.direction === direction &&
        arrow.isBothPlayers &&
        !arrow.hit &&
        !arrow.missed &&
        ((player === 'player1' && arrow.player === 'player1') ||
          (player === 'player2' && arrow.player === 'player2'))
    );

    if (hasBothPlayersArrow) {
      switch (direction) {
        case 'left': return leftPurpleArrow;
        case 'up': return upPurpleArrow;
        case 'right': return rightPurpleArrow;
        case 'down': return downPurpleArrow;
        default: return null;
      }
    } else {
      switch (direction) {
        case 'left': return leftArrow;
        case 'up': return upArrow;
        case 'right': return rightArrow;
        case 'down': return downArrow;
        default: return null;
      }
    }
  };

  const handleReturn = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onBackToSelection();
  };

  const getIndicatorClass = (type) => {
    return type === 'hit' ? 'hit' : 'miss';
  };

  const getIndicatorText = (type) => {
    return type === 'hit' ? 'HIT' : 'MISS';
  };

  const calculateAccuracy = (stats) => {
    if (stats.totalArrows === 0) return '0%';
    const accuracy = (stats.arrowsHit / stats.totalArrows) * 100 / 2;
    return `${accuracy.toFixed(1)}%`;
  };

  const renderReadyScreen = () => {
    return (
      <div className="ready-wrapper">
        <div className="ready-container">
          <h2 className="ready-title">Pulse</h2>
          <div className={`ready-prompt ${player1Ready ? 'ready' : ''}`}>
            Welcome Player 1. <br /> Press any key (←↑→↓) to ready up.
            {player1Ready && <div className="ready-check">✓</div>}
          </div>
          <button className="back-button" onClick={handleReturn}>
            Back to Song Selection (Press *)
          </button>
        </div>
        <div className="ready-container">
          <h2 className="ready-title">Pulse</h2>
          <div className={`ready-prompt ${player2Ready ? 'ready' : ''}`}>
            Welcome Player 2. <br /> Press any key (←↑→↓) to ready up.
            {player2Ready && <div className="ready-check">✓</div>}
          </div>
          <button className="back-button" onClick={handleReturn}>
            Back to Song Selection (Press *)
          </button>
        </div>
      </div>
    );
  };

  const renderGameContent = () => {
    if (gameState === 'waiting') {
      return renderReadyScreen();
    } else if (gameState === 'ended') {
      return (
        <div className="game-ended-wrapper">
          <div className="end-container">
            <h2 className="end-title">Game Over</h2>
            <div className="end-player-score">
              <h3 className="end-player-header">Player 1 Stats:</h3>
              <div className="end-score-display">Personal Score: {player1Score}</div>
              <div className="player-stats">
                <div className="stat-row">Perfect Arrows: {player1Stats.perfectHits / 2}</div>
                <div className="stat-row">Good Arrows: {player1Stats.goodHits / 2}</div>
                <div className="stat-row">Okay Arrows: {player1Stats.okHits / 2}</div>
                <div className="stat-row">Misses: {player1Stats.misses / 2}</div>
                <div className="stat-row">Accuracy: {calculateAccuracy(player1Stats)}</div>
                <div className="stat-row">Max Combo: {Math.floor(player1MaxCombo)}</div>
              </div>
              <div className="end-team-score">
                Total Team Score: {player1Score + player2Score}
              </div>
            </div>
            <div className={`ready-to-go-back ${player1ReadyToGoBack ? 'ready' : ''}`}>
              {player1ReadyToGoBack ? 'Readied up! (* to cancel)' : 'Back to Main Menu (*)'}
              {player1ReadyToGoBack && <span className="ready-check">✓</span>}
              {player1ReadyToGoBack && <div className="cancel-info">Press Q to cancel ready</div>}
            </div>
          </div>
          <div className="end-container">
            <h2 className="end-title">Game Over</h2>
            <div className="end-player-score">
              <h3 className="end-player-header">Player 2 Stats:</h3>
              <div className="end-score-display">Personal Score: {player2Score}</div>
              <div className="player-stats">
                <div className="stat-row">Perfect Arrows: {player2Stats.perfectHits / 2}</div>
                <div className="stat-row">Good Arrows: {player2Stats.goodHits / 2}</div>
                <div className="stat-row">Okay Arrows: {player2Stats.okHits / 2}</div>
                <div className="stat-row">Misses: {player2Stats.misses / 2}</div>
                <div className="stat-row">Accuracy: {calculateAccuracy(player2Stats)}</div>
                <div className="stat-row">Max Combo: {Math.floor(player2MaxCombo)}</div>
              </div>
              <div className="end-team-score">
                Total Team Score: {player1Score + player2Score}
              </div>
            </div>
            <div className={`ready-to-go-back ${player2ReadyToGoBack ? 'ready' : ''}`}>
              {player2ReadyToGoBack ? 'Readied up! (* to cancel)' : 'Back to Main Menu (*)'}
              {player2ReadyToGoBack && <span className="ready-check">✓</span>}
              {player2ReadyToGoBack && <div className="cancel-info">Press 1 to cancel ready</div>}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className="lanes">
            <div className="player-section">
              <div className="player-header">Player 1</div>
              <div className="score-container">
                <div className="score-box">Team Score: {player1Score + player2Score}</div>
              </div>
              <div className="player-lanes player1">
                {directions.map((direction) => (
                  <div key={`player1-${direction}`} className={`lane ${direction}`}>
                    <div className="guideline"></div>
                    <div className="static-arrow">
                      <img src={getArrowImage(direction)} alt={direction} />
                    </div>
                    {arrows
                      .filter((arrow) => arrow.player === 'player2' && arrow.direction === direction && !arrow.hit)
                      .map((arrow) => (
                        <Arrow
                          key={arrow.id}
                          direction={arrow.direction}
                          player="player1"
                          missed={arrow.missed}
                          isBothPlayers={arrow.isBothPlayers}
                        />
                      ))}
                  </div>
                ))}
              </div>
              {player1Indicator.show && (
                <div className={`hit-indicator ${getIndicatorClass(player1Indicator.type)}`}>
                  {getIndicatorText(player1Indicator.type)}
                </div>
              )}
              <div className="combo-display">
                Combo: {Math.floor(player1Combo)}
              </div>
              <div className="controls-guide player1-controls">
                <span className="key">L (←)</span> <span className="key">U (↑)</span> <span className="key">R (→)</span> <span className="key">D (↓)</span>
              </div>
            </div>

            <div className="player-section">
              <div className="player-header">Player 2</div>
              <div className="score-container">
                <div className="score-box">Team Score: {player1Score + player2Score}</div>
              </div>
              <div className="player-lanes player2">
                {directions.map((direction) => (
                  <div key={`player2-${direction}`} className={`lane ${direction}`}>
                    <div className="guideline"></div>
                    <div className="static-arrow">
                      <img src={getArrowImage(direction)} alt={direction} />
                    </div>
                    {arrows
                      .filter((arrow) => arrow.player === 'player1' && arrow.direction === direction && !arrow.hit)
                      .map((arrow) => (
                        <Arrow
                          key={arrow.id}
                          direction={arrow.direction}
                          player="player2"
                          missed={arrow.missed}
                          isBothPlayers={arrow.isBothPlayers}
                        />
                      ))}
                  </div>
                ))}
              </div>
              {player2Indicator.show && (
                <div className={`hit-indicator ${getIndicatorClass(player2Indicator.type)}`}>
                  {getIndicatorText(player2Indicator.type)}
                </div>
              )}
              <div className="combo-display">
                Combo: {Math.floor(player2Combo)}
              </div>
              <div className="controls-guide player2-controls">
                <span className="key">L (←)</span> <span className="key">U (↑)</span> <span className="key">R (→)</span> <span className="key">D (↓)</span>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="game">
      {renderGameContent()}
    </div>
  );
};

export default Game;