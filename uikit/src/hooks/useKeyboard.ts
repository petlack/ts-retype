import { useEffect } from 'react';

export function useKeybaord() {
  const downHandler = ({ key }) => {
    if (key === 'ArrowUp') {
      console.log('ArrowUp');
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  });
}
