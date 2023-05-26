import { useEffect } from 'react';

export function useKeybaord() {
  const downHandler = ({ key }: KeyboardEvent) => {
    if (key === 'ArrowUp') {
      // eslint-disable-next-line no-console
      console.log('ArrowUp');
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  });
}
