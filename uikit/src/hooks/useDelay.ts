import { useEffect, useRef } from 'react';

export type UseDelayOptions = {
  delay: number;
};

export function useDelay(callback: () => void, { delay }: UseDelayOptions) {
  const timeout = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  const stop = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  };

  useEffect(() => {
    timeout.current = setTimeout(() => {
      if (callbackRef.current) {
        callbackRef.current();
      }
    }, delay);

    return stop;
  }, []);

  return { stop };
}
