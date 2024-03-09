import React, { useCallback } from 'react';
import { Key, useApp } from 'ink';
import { useKeymap } from '../hooks/useKeymap.js';

export const ExitProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { exit } = useApp();

  const handler = useCallback((_input: string, key: Key) => {
    if (key.escape) {
      exit();
    }
  }, []);

  useKeymap(handler);

  return children;
};
