import { useEffect } from 'react';

export type UseKeyProps = {
  key: KeyboardEvent['key'];
  handler: () => void;
};

export function useKey({ key, handler }: UseKeyProps) {
  const keyHandler = ({ key: pressedKey }: KeyboardEvent) => {
    if (key === pressedKey) {
      handler && handler();
    }
  };
  useEffect(() => {
    window.addEventListener('keyup', keyHandler);

    return () => {
      window.removeEventListener('keyup', keyHandler);
    };
  });
}
