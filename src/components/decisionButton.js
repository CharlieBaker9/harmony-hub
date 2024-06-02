import React from 'react';
import '../componentsStyling/decisionButton.css';

const DecisionButton = ({ text, opportunity, type, isActive, onClick, index }) => {
  const handleClick = () => {
    onClick(index, type, opportunity);
  };

  return (
    <button
      className={`decision-button ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      {text || opportunity}
    </button>
  );
};

export default DecisionButton;
