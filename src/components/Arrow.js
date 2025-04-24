import React from 'react';

import upArrow from '../assets/upArrow.png';
import downArrow from '../assets/downArrow.png';
import leftArrow from '../assets/leftArrow.png';
import rightArrow from '../assets/rightArrow.png';

import upPurpleArrow from '../assets/upPurpleArrow.png';
import downPurpleArrow from '../assets/downPurpleArrow.png';
import leftPurpleArrow from '../assets/leftPurpleArrow.png';
import rightPurpleArrow from '../assets/rightPurpleArrow.png';

const Arrow = ({ direction, player, missed, isBothPlayers }) => {
  const getArrowImage = () => {
    // Use purple arrows when it's for both players
    if (isBothPlayers) {
      switch (direction) {
        case 'left': return leftPurpleArrow;
        case 'up': return upPurpleArrow;
        case 'right': return rightPurpleArrow;
        case 'down': return downPurpleArrow;
        default: return null;
      }
    } else {
      // Regular arrows for individual players
      switch (direction) {
        case 'left': return leftArrow;
        case 'up': return upArrow;
        case 'right': return rightArrow;
        case 'down': return downArrow;
        default: return null;
      }
    }
  };

  return (
    <div className={`arrow ${direction} ${player} ${missed ? 'missed' : ''} ${isBothPlayers ? 'both-players' : ''}`}>
      <img src={getArrowImage()} alt={direction} />
    </div>
  );
};

export default Arrow;