import React from 'react';

import './style.scss';

const Button = (props) => {
  const {
    onClick, buttonStyle, children,
  } = props;

  return <button type="button" onClick={onClick} className={`button animated-button button button-${buttonStyle}`}>{children}</button>;
};

export default Button;
