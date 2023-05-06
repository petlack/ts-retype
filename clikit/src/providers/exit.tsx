import React, { useCallback, useEffect } from 'react';
import { Key, useApp } from 'ink';
import { useKeymap } from '../hooks/useKeymap.js';

export const ExitProvider: React.FC<{ children: JSX.Element }>  = ({ children }) => {
  const { exit } = useApp();
  const { addBinding, removeBinding } = useKeymap();

  const handler = useCallback((_input: string, key: Key) => {
    if (key.escape) {
      exit();
    }
  }, []);

  useEffect(() => {
    const handle = addBinding(handler);
    return () => {
      removeBinding(handle);
    };
  }, [addBinding, removeBinding, handler]);

  return children;
};