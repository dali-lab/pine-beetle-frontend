import React, { useEffect, useState } from 'react';

import './style.scss';

const ScrollHint = () => {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollY } = window;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      const isBottom = scrollY + viewportHeight >= fullHeight - 10;
      setAtBottom(isBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (!atBottom && <div className="scroll-hint">↓</div>);
};

export default ScrollHint;
