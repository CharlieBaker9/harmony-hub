import React from 'react';
import '../componentsStyling/decisionButton.css';

const DecisionButton = ({ text, type, index, onClick, isActive }) => {
  const buttonClass = isActive ? 'decision-button active' : 'decision-button';

  return (
    <button
      className={buttonClass}
      onClick={() => onClick(index, type, text)}
    >
      {text}
    </button>
  );
};

export default DecisionButton;
