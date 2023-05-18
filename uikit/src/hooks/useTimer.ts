import { useCallback, useEffect, useRef } from 'react';

export type UseTimerOptions = {
  interval: number;
};

export function useTimer(callback: (ticks: number) => void, { interval }: UseTimerOptions) {
  const timer = useRef<NodeJS.Timeout>();
  let ticks = 0;

  const stop = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  };

  const tick = useCallback(() => {
    callback(ticks);
    ticks += 1;
  }, [ticks, callback]);

  useEffect(() => {
    timer.current = setInterval(tick, interval);
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  return { stop: useCallback(stop, []) };
}
