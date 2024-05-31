import React, { useState } from 'react';

function DecisionButton({ opportunity, type }) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  if (!opportunity) {
    // Return a placeholder div to keep spacing consistent
    return <div style={{ display: 'inline-block', width: '75px', height: '30px' }} />;
  }

  return (
    <button
      onClick={handleClick}
      style={{
        width: '75px',
        height: '30px',
        backgroundColor: isClicked ? 'red' : 'initial',
        margin: '5px',
      }}
    >
      {type}
    </button>
  );
}

export default DecisionButton;
