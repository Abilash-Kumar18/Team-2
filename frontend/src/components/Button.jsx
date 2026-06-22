import React from 'react';

const Button = ({ text, onClick, type = 'button', disabled = false, variant = 'primary' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {text}
    </button>
  );
};

export default Button;
