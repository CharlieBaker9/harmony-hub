import React, { useState } from 'react';
import '../componentsStyling/arrowButton.css';

const ArrowButton = ({ type, row, index, isEnabled }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (isEnabled) {
      setIsClicked(true);
      console.log(`${type} button clicked in row ${row}, index ${index}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`arrow-button ${isClicked ? 'clicked' : ''}`}
      style={{
        backgroundColor: isClicked ? 'red' : (isEnabled ? '#007bff' : '#cccccc'),
        cursor: isEnabled ? 'pointer' : 'not-allowed',
      }}
    >
      {type === 'up' ? '↑' : '↓'}
    </button>
  );
};

export default ArrowButton;
