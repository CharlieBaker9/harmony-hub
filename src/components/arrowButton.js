import React from 'react';
import '../componentsStyling/arrowButton.css';

const ArrowButton = ({ type, row, index, isEnabled, onClick }) => {
  const handleClick = () => {
    if (isEnabled) {
      console.log(`${type} button clicked in row ${row}, index ${index}`);
      onClick(row, index, type);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`arrow-button ${!isEnabled ? 'disabled' : ''}`}
    >
      {type === 'up' ? '↑' : '↓'}
    </button>
  );
};

export default ArrowButton;
