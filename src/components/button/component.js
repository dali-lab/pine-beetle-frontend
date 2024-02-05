import React from 'react';

import './style.scss';

const Button = (props) => {
  const {
    onClick, buttonStyle = 'primary', children, className = '',
  } = props;

  return <button type="button" onClick={onClick} className={`button animated-button button button-${buttonStyle} ${className}`}>{children}</button>;
};

export default Button;
