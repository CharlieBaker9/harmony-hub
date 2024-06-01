import React from 'react';

const Dropdown = ({ label, options, onChange, value, id, className, disabled = false }) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <select id={id} onChange={onChange} value={value} className={className} disabled={disabled}>
        <option value="">Select...</option> {/* Adding default option */}
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
