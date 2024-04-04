// src/Dropdown.js
import React from 'react';

const Dropdown = ({ label, options, onChange, disabled = false }) => {
  return (
    <div>
      <label>{label}</label>
      <select onChange={onChange} disabled={disabled}>
        <option value="">Select...</option> {/* Adding default option */}
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;