import React, { useState, useEffect } from "react";

const StartMenu = ({ onStartGame, onHowToPlay }) => {
    const [player1Ready, setPlayer1Ready] = useState(false);
    const [player2Ready, setPlayer2Ready] = useState(false);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [pulseEffect, setPulseEffect] = useState(false);

    // Pulsing title effect
    useEffect(() => {
        const interval = setInterval(() => {
            setPulseEffect(prev => !prev);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();

            if (showHowToPlay) {
                if (["e", "2"].includes(key)) {
                    setShowHowToPlay(false);
                }
                return;
            }

            // Player 1 controls - Q to ready up/un-ready
            if (key === "q") {
                setPlayer1Ready(prev => !prev);
            }

            // Player 2 controls - 1 to ready up/un-ready
            if (key === "1") {
                setPlayer2Ready(prev => !prev);
            }

            // Either player can access how to play
            if (["e", "2"].includes(key)) {
                setShowHowToPlay(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showHowToPlay]);

    useEffect(() => {
        if (player1Ready && player2Ready) {
            const timer = setTimeout(() => {
                onStartGame();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [player1Ready, player2Ready, onStartGame]);

    return (
        <>
            <div className="start-menu-wrapper">
                {showHowToPlay ? (
                    <HowToPlayComponent onHowToPlay={() => setShowHowToPlay(false)} />
                ) : (
                    <>
                        <div className="start-menu-container">
                            <div className="player-label">Player 1</div>
                            <h1 className={`game-title ${pulseEffect ? 'pulse' : ''}`}>
                                <span className="title-gradient">Pulse</span>
                            </h1>
                            <div className={`ready-status ${player1Ready ? 'ready' : 'not-ready'}`}>
                                <div className="status-content">
                                    {player1Ready ? (
                                        <>
                                            <span className="ready-icon">✓</span>
                                            <span>READY!</span>
                                        </>
                                    ) : (
                                        'Press Q to ready up'
                                    )}
                                </div>
                                {player1Ready && <div className="ready-particles"></div>}
                            </div>
                            <div className="instructions">
                                <p className="instruction-item">
                                    <span className="key-hint">*</span> {player1Ready ? "Press again to un-ready" : "Ready up"}
                                </p>
                                <p className="instruction-item">
                                    <span className="key-hint">ó</span> How to play
                                </p>
                            </div>
                            <div className="glow-effect"></div>
                        </div>

                        <div className="start-menu-container">
                            <div className="player-label">Player 2</div>
                            <h1 className={`game-title ${pulseEffect ? 'pulse' : ''}`}>
                                <span className="title-gradient">Pulse</span>
                            </h1>
                            <div className={`ready-status ${player2Ready ? 'ready' : 'not-ready'}`}>
                                <div className="status-content">
                                    {player2Ready ? (
                                        <>
                                            <span className="ready-icon">✓</span>
                                            <span>READY!</span>
                                        </>
                                    ) : (
                                        'Press 1 to ready up'
                                    )}
                                </div>
                                {player2Ready && <div className="ready-particles"></div>}
                            </div>
                            <div className="instructions">
                                <p className="instruction-item">
                                    <span className="key-hint">*</span> {player2Ready ? "Press again to un-ready" : "Ready up"}
                                </p>
                                <p className="instruction-item">
                                    <span className="key-hint">ó</span> How to play
                                </p>
                            </div>
                            <div className="glow-effect"></div>
                        </div>
                    </>
                )}
            </div>

            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Poppins:wght@400;600;700&display=swap');
        
        :root {
          --primary: #6c5ce7;
          --primary-light: #a29bfe;
          --primary-dark: #5548c5;
          --secondary: #ff7675;
          --secondary-light: #ff85a2;
          --secondary-dark: #e05c5c;
          --accent: #00cec9;
          --accent-light: #55efc4;
          --background: #f8f9fa;
          --card-bg: rgba(255, 255, 255, 0.92);
          --text-dark: #343a40;
          --text-light: #f8f9fa;
          --text-muted: #666;
          --border-light: rgba(0, 0, 0, 0.08);
          --glow-color: rgba(108, 92, 231, 0.3);
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
          overflow: hidden;
        }

        .start-menu-wrapper {
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 400px;
          width: 100%;
          max-width: 1800px;
          padding: 30px 20px;
          margin: 0 auto;
          box-sizing: border-box;
          position: relative;
        }

        .start-menu-container {
          flex: 1;
          min-width: 500px;
          max-width: 500px;
          background: var(--card-bg);
          border-radius: 20px;
          padding: 40px 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
          border: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          backdrop-filter: blur(10px);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        
        .start-menu-container:hover {
          transform: translateY(-5px) scale(1.01);
          box-shadow: 0 15px 40px rgba(108, 92, 231, 0.15);
        }
        
        .start-menu-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          z-index: 2;
        }

        .player-label {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 15px;
          position: relative;
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .player-label::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 3px;
          background: linear-gradient(to right, var(--primary), var(--accent));
          border-radius: 2px;
        }

        .game-title {
          font-size: 4.5rem;
          font-weight: 800;
          font-family: 'Montserrat', sans-serif;
          margin: 20px 0 30px;
          text-shadow: 0 0 20px rgba(162, 155, 254, 0.2);
          letter-spacing: 2px;
          position: relative;
          z-index: 1;
        }
        
        .game-title.pulse {
          animation: pulse 1.5s ease infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .title-gradient {
          background: linear-gradient(135deg, var(--primary-light), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }

        .ready-status {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 30px 0;
          padding: 20px 40px;
          border-radius: 12px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          width: 80%;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ready-status.ready {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          box-shadow: 0 5px 25px rgba(108, 92, 231, 0.3);
          transform: translateY(-5px);
        }

        .ready-status.not-ready {
          background: rgba(0, 0, 0, 0.03);
          color: var(--text-muted);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .status-content {
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 2;
        }
        
        .ready-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: white;
          color: var(--primary);
          border-radius: 50%;
          font-weight: bold;
          font-size: 1.2rem;
          animation: popIn 0.3s ease;
        }
        
        @keyframes popIn {
          0% { transform: scale(0); }
          80% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .ready-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          z-index: 1;
        }
        
        .ready-particles::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
          opacity: 0.3;
          animation: particles 3s linear infinite;
        }
        
        @keyframes particles {
          0% { transform: translate(0, 0); }
          100% { transform: translate(100px, 100px); }
        }

        .instructions {
          margin-top: 40px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .instruction-item {
          font-size: 1.1rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 0;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .instruction-item:hover {
          background: rgba(0, 0, 0, 0.03);
          color: var(--text-dark);
        }
        
        .key-hint {
          background: rgba(0, 0, 0, 0.05);
          color: var(--primary);
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid var(--border-light);
          font-family: monospace;
          font-weight: bold;
          font-size: 1rem;
          min-width: 50px;
          display: inline-block;
          text-align: center;
        }
        
        .glow-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, var(--glow-color) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: -1;
        }
        
        .start-menu-container:hover .glow-effect {
          opacity: 0.4;
        }

        /* How to Play styles */
        .how-to-play {
          flex: 1;
          min-width: 800px;
          max-width: 1000px;
          background: var(--card-bg);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
          border: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }
        
        .how-to-play::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--secondary), var(--accent));
          z-index: 2;
        }

        .how-to-play h1 {
          font-size: 3rem;
          font-family: 'Montserrat', sans-serif;
          color: transparent;
          background: linear-gradient(135deg, var(--secondary-light), var(--accent));
          -webkit-background-clip: text;
          background-clip: text;
          margin-bottom: 10px;
        }
        
        .how-to-play h2 {
          font-size: 1.8rem;
          color: var(--primary);
          margin-bottom: 30px;
          font-weight: 600;
        }
        
        .how-to-play h3 {
          font-size: 1.5rem;
          color: var(--secondary);
          margin: 25px 0 15px;
          font-weight: 600;
          text-align: left;
          width: 100%;
          max-width: 700px;
        }

        .how-to-play p {
          font-size: 1.2rem;
          line-height: 1.8;
          margin: 15px 0;
          color: var(--text-dark);
          position: relative;
          padding-left: 40px;
          text-align: left;
          max-width: 700px;
        }
        
        .how-to-play p::before {
          content: '';
          position: absolute;
          left: 0;
          top: 12px;
          width: 20px;
          height: 2px;
          background: var(--accent);
        }
        
        .how-to-play .intro-text {
          margin-bottom: 20px;
          font-weight: 500;
          font-size: 1.3rem;
          padding-left: 0;
          text-align: center;
          max-width: 700px;
        }
        
        .how-to-play .intro-text::before {
          display: none;
        }
        
        .how-to-play .special-note {
          font-style: italic;
          color: var(--secondary);
          font-weight: 500;
        }

        .back-instruction {
          margin-top: 40px;
          font-size: 1.2rem;
          color: var(--secondary-light);
          font-weight: 600;
          padding: 12px 25px;
          border-radius: 30px;
          background: rgba(255, 117, 117, 0.1);
          border: 1px solid rgba(255, 117, 117, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .back-instruction:hover {
          background: rgba(255, 117, 117, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 117, 117, 0.1);
        }

        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .start-menu-wrapper {
            flex-direction: column;
            align-items: center;
            gap: 40px;
          }
          
          .start-menu-container, .how-to-play {
            min-width: 90%;
            max-width: 600px;
            padding: 30px 25px;
          }
          
          .game-title {
            font-size: 3.5rem;
          }
          
          .how-to-play h1 {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 600px) {
          .game-title {
            font-size: 2.8rem;
          }
          
          .ready-status {
            font-size: 1.3rem;
            padding: 15px 25px;
            min-height: 70px;
          }
          
          .instructions {
            gap: 10px;
          }
          
          .instruction-item {
            font-size: 1rem;
          }
          
          .key-hint {
            padding: 4px 8px;
            min-width: 40px;
          }
          
          .how-to-play p {
            font-size: 1rem;
            padding-left: 30px;
          }
        }
      `}</style>
        </>
    );
};

const HowToPlayComponent = ({ onHowToPlay }) => {
    const [currentPage, setCurrentPage] = useState([0, 0]); // [player1Page, player2Page]
    const totalPages = 3; // Assuming a total of 3 pages of content for each player

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Player 1 navigation - A and D keys
            if (e.key.toLowerCase() === 'a') {
                setCurrentPage(prev => [Math.max(prev[0] - 1, 0), prev[1]]);
            } else if (e.key.toLowerCase() === 'd') {
                setCurrentPage(prev => [Math.min(prev[0] + 1, totalPages - 1), prev[1]]);
            }

            // Player 2 navigation - left and right arrow keys
            if (e.key === 'ArrowLeft') {
                setCurrentPage(prev => [prev[0], Math.max(prev[1] - 1, 0)]);
            } else if (e.key === 'ArrowRight') {
                setCurrentPage(prev => [prev[0], Math.min(prev[1] + 1, totalPages - 1)]);
            }

            if (e.key.toLowerCase() === 'e' || e.key === '2') {
                onHowToPlay();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onHowToPlay]);

    // Content for each page for each player
    const player1Pages = [
        <>
            <h3>Game Concept</h3>
            <p>Player 1 sees arrows that Player 2 must hit, and vice versa.</p>
            <p>You must shout out the arrows to your partner in real-time so they can press the correct key.</p>
            <p>The red guideline on your screen is the "shout timing" reference.</p>
            <p>A "HIT/MISS" indicator has been provided to see if your partner has hit an arrow. If you see that they keep missing it, maybe you call their arrows out before or after the red line.</p>
            <p>Purple arrows mean both players must hit arrows at the same time—so you must both shout AND listen!</p>
        </>,
        <>
            <h3>Arrow Types:</h3>
            <p>Normal Arrows: Black arrows - only one player needs to hit these</p>
            <p>Purple Arrows: Special arrows that appear for both players simultaneously</p>

            <h3>Scoring System</h3>
            <p>Perfect Hit (within 50ms): 75 points + combo bonus</p>
            <p>Good Hit (within 100ms): 50 points + combo bonus</p>
            <p>Okay Hit (within 200ms): 25 points + combo bonus</p>
            <p>Miss: 0 points and breaks your combo</p>
        </>,
        <>
            <h3>Combo System:</h3>
            <p>Each hit increases your combo, each miss resets it to 0</p>
            <p>Combos multiply your score (up to 100% bonus at 10+ combo)</p>
            <p>Your max combo is tracked and displayed at the end</p>
            <p>Spamming keys will reset your combo and deduct points</p>
            
            <h3>Special Notes</h3>
            <p>Purple arrows require both players to hit simultaneously!</p>
            <p>Communication is key - adjust your timing based on the HIT/MISS indicators.</p>
            <p>Have fun and work together!</p>
        </>
    ];

    const player2Pages = [
        <>
            <h3>Game Concept</h3>
            <p>Player 1 sees arrows that Player 2 must hit, and vice versa.</p>
            <p>You must shout out the arrows to your partner in real-time so they can press the correct key.</p>
            <p>The red guideline on your screen is the "shout timing" reference.</p>
            <p>A "HIT/MISS" indicator has been provided to see if your partner has hit an arrow. If you see that they keep missing it, maybe you call their arrows out before or after the red line.</p>
            <p>Purple arrows mean both players must hit arrows at the same time—so you must both shout AND listen!</p>
        </>,
        <>
            <h3>Arrow Types:</h3>
            <p>Normal Arrows: Black arrows - only one player needs to hit these</p>
            <p>Purple Arrows: Special arrows that appear for both players simultaneously</p>

            <h3>Scoring System</h3>
            <p>Perfect Hit (within 50ms): 75 points + combo bonus</p>
            <p>Good Hit (within 100ms): 50 points + combo bonus</p>
            <p>Okay Hit (within 200ms): 25 points + combo bonus</p>
            <p>Miss: 0 points and breaks your combo</p>
        </>,
        <>
            <h3>Combo System:</h3>
            <p>Each hit increases your combo, each miss resets it to 0</p>
            <p>Combos multiply your score (up to 100% bonus at 10+ combo)</p>
            <p>Your max combo is tracked and displayed at the end</p>
            <p>Spamming keys will reset your combo and deduct points</p>
            
            <h3>Special Notes</h3>
            <p>Purple arrows require both players to hit simultaneously!</p>
            <p>Communication is key - adjust your timing based on the HIT/MISS indicators.</p>
            <p>Have fun and work together!</p>
        </>
    ];

    return (
        <>
            <div className="how-to-play-container">
                <div className="how-to-play-panel">
                    <h1>Pulse</h1>
                    <h2>How to Play - Player 1</h2>
                    <div className="how-to-play-content">
                        {player1Pages[currentPage[0]]}
                    </div>
                    <div className="page-navigation">
                        <p>Page {currentPage[0] + 1} of {totalPages}</p>
                        <p>Use A/D to navigate</p>
                        <p className="back-instruction">Go back to Main Menu (ó)</p>
                    </div>
                </div>

                <div className="how-to-play-panel">
                    <h1>Pulse</h1>
                    <h2>How to Play - Player 2</h2>
                    <div className="how-to-play-content">
                        {player2Pages[currentPage[1]]}
                    </div>
                    <div className="page-navigation">
                        <p>Page {currentPage[1] + 1} of {totalPages}</p>
                        <p>Use ←/→ to navigate</p>
                        <p className="back-instruction">Go back to Main Menu (ó)</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
          .how-to-play-container {
            display: flex;
            justify-content: center;
            align-items: stretch;
            gap: 360px;
            width: 100%;
            max-width: 1800px;
            padding: 30px 20px;
            margin: 0 auto;
            box-sizing: border-box;
            position: relative;
          }
  
          .how-to-play-panel {
            flex: 1;
            min-width: 500px;
            max-width: 500px;
            background: var(--card-bg);
            border-radius: 20px;
            padding: 40px 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
            border: 1px solid var(--border-light);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
            height: 800px; /* Fixed height for each panel */
          }
  
          .how-to-play-panel h1 {
            font-size: 3rem;
            font-family: 'Montserrat', sans-serif;
            color: transparent;
            background: linear-gradient(135deg, var(--secondary-light), var(--accent));
            -webkit-background-clip: text;
            background-clip: text;
            margin-bottom: 10px;
          }
  
          .how-to-play-panel h2 {
            font-size: 1.4rem;
            color: var(--primary);
            margin-bottom: 30px;
            font-weight: 600;
          }
  
          .how-to-play-content {
            flex: 1;
            width: 100%;
            text-align: left;
            padding: 0 20px;
            margin-bottom: 20px;
            overflow-y: auto;
            min-height: 400px;
          }
  
          .how-to-play-content h3 {
            font-size: 1.2rem;
            color: var(--secondary);
            margin: 25px 0 15px;
            font-weight: 600;
          }
  
          .how-to-play-content p {
            font-size: 1.2rem;
            line-height: 1.6;
            margin: 15px 0;
            font-size: 1rem;
            color: var(--text-dark);
          }
  
          .page-navigation {
            margin-top: auto;
            font-size: .9rem;
            color: var(--text-muted);
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 140px; /* Fixed height for navigation */
            justify-content: center;
          }
  
          .back-instruction {
            margin-top: 15px;
            font-size: 1.2rem;
            color: var(--secondary-light);
            font-weight: 600;
            padding: 12px 25px;
            border-radius: 30px;
            background: rgba(255, 117, 117, 0.1);
            border: 1px solid rgba(255, 117, 117, 0.2);
            transition: all 0.3s ease;
          }
  
        `}</style>
        </>
    );
};

export default StartMenu;