import React from 'react';

import upArrow from '../assets/upArrow.png';
import downArrow from '../assets/downArrow.png';
import leftArrow from '../assets/leftArrow.png';
import rightArrow from '../assets/rightArrow.png';

const Arrow = ({ direction, player, missed }) => {
  const getArrowImage = () => {
    switch (direction) {
      case 'left': return leftArrow;
      case 'up': return upArrow;
      case 'right': return rightArrow;
      case 'down': return downArrow;
      default: return null;
    }
  };

  return (
    <div className={`arrow ${direction} ${player} ${missed ? 'missed' : ''}`}>
      <img src={getArrowImage()} alt={direction} />
    </div>
  );
};

export default Arrow;