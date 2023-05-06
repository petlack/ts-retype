import React from 'react';
import { Box, Text } from 'ink';
import { Timing } from '../hooks/useTiming.js';

function repeat<T>(what: T, times: number) {
  return [...Array(times).keys()].map(() => what);
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

function formatDuration(durationMs: number) {
  const ms = ((durationMs % 1000) / 10).toFixed(0).padStart(2, '0');
  const sec = Math.floor(durationMs / SECOND);
  const min = Math.floor(durationMs / MINUTE);
  const hour = Math.floor(durationMs / HOUR);

  const secStr = sec.toFixed(0).padStart(2, '0');
  const minStr = min.toFixed(0).padStart(2, '0');
  const hourStr = hour.toFixed(0).padStart(2, '0');
  
  if (hour === 0 && min === 0) {
    return `${minStr}:${secStr}.${ms}`;
  }
  if (hour === 0 && min > 0) {
    return `${minStr}:${secStr}.${ms}`;
  }
  return `${hourStr}:${minStr}:${secStr}`;
}

export type ProgressBarProps = Timing;

export function InfiniteProgress({ duration }: ProgressBarProps) {
  const durationStr = formatDuration(duration);

  return (
    <Box width={20} height={5} flexDirection='column'>
      <Text backgroundColor='magenta'>{repeat(' ', 20)}</Text>
      <Text backgroundColor='magenta'>{repeat(' ', 20)}</Text>
      <Text backgroundColor='magenta'>      {durationStr}      </Text>
      <Text backgroundColor='magenta'>{repeat(' ', 20)}</Text>
      <Text backgroundColor='magenta'>{repeat(' ', 20)}</Text>
    </Box>
  );
}