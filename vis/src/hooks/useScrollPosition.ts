import { useState, useEffect } from 'react';

interface ScrollPosition {
  scrollLeft: number;
  scrollTop: number;
}

function get(): ScrollPosition {
  return {
    scrollLeft: window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop: window.pageYOffset || document.documentElement.scrollTop,
  };
}

export function useScrollPosition(): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>(get());

  useEffect(() => {
    const handleScroll = () => {
      setPosition(get());
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return position;
}
