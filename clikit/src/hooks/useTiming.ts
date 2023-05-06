import { useCallback, useState } from 'react';

export type Timing = {
  progress: number;
  duration: number;
  speed: number;
};

export function useTiming(): {
  tick: (progress: number) => void;
  timing: Timing;
} {
  const [timing, setTiming] = useState<Timing>({
    progress: 0,
    duration: 0,
    speed: 0,
  });

  const startedAt = new Date().getTime();

  const tick = useCallback(
    (progress: number) => {
      setTiming((old) => {
        const now = new Date().getTime();
        const duration = startedAt ? now - startedAt : 0;
        const progressDelta = progress - old.progress;
        const durationDelta = duration - old.duration;
        const speed = durationDelta !== 0 ? progressDelta / durationDelta : 0;
        return {
          ...old,
          progress,
          duration,
          speed,
        };
      });
    },
    [timing],
  );

  return { tick, timing };
}
