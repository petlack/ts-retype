import React, { useEffect, useRef, useState } from 'react';
import { Box, DOMElement, Text, measureElement } from 'ink';

function repeat<T>(what: T, times: number) {
  return [...Array(times).keys()].map(() => what);
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

function formatDuration(durationMs: number) {
  const ms = ((durationMs % 1000) / 10).toFixed(0).padStart(2, '0');
  const sec = Math.floor(durationMs / SECOND) % 60;
  const min = Math.floor(durationMs / MINUTE) % 60;
  const hour = Math.floor(durationMs / HOUR);

  const secStr = sec.toFixed(0).padStart(2, '0');
  const minStr = min.toFixed(0).padStart(2, '0');
  const hourStr = hour.toFixed(0).padStart(2, '0');
  
  if (hour === 0 && min === 0) {
    return `${secStr}.${ms}`;
  }
  if (hour === 0 && min > 0) {
    return `${minStr}:${secStr}`;
  }
  return `${hourStr}:${minStr}:${secStr}`;
}

export type ProgressBarProps = {
  progress: number;
  duration: number;
  speed: number;
  width?: number;
}

export function ProgressBar({ progress, duration, speed }: ProgressBarProps) {
  const barRef = useRef<DOMElement>(null);
  const [barWidth, setBarWidth] = useState(0);

  const cappedProgress = Math.min(1, Math.max(0, progress));
  const filledWidth = Math.ceil(cappedProgress * barWidth);

  const progressStr = `${(cappedProgress * 100).toFixed()}%`;
  const speedStr = `${(speed * 100 * 1000).toFixed(2)}%/s`;
  const durationStr = formatDuration(duration);

  useEffect(() => {
    if (barRef.current) {
      const { width } = measureElement(barRef.current);
      setBarWidth(width);
    }
  }, [barRef, setBarWidth]);

  return (
    <Box>
      <Box flexGrow={1} flexDirection='row'>
        <Box flexGrow={1} ref={barRef}>
          <Text backgroundColor='blueBright'>{repeat(' ', filledWidth)}</Text>
          <Text backgroundColor='black'>{repeat(' ', barWidth - filledWidth)}</Text>
        </Box>
        <Box flexDirection='row' gap={1} justifyContent='flex-end'>
          <Text>{progressStr}</Text>
          <Text>{durationStr}</Text>
          <Text>{speedStr}</Text>
        </Box>
      </Box>
    </Box>
  );
}