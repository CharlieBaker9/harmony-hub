// src/components/decisionButton.js
import React, { useState } from 'react';

function DecisionButton({ label, text }) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button onClick={handleClick}>{label}</button>
      {isVisible && <pre>{text}</pre>}
    </div>
  );
}

export default DecisionButton;
