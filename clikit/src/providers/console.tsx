import React, { useState, useCallback } from 'react';
import { ConsoleContext } from '../hooks/useConsole.js';
import { Key } from 'ink';
import { useKeymap } from '../hooks/useKeymap.js';

export type ConsoleProviderProps = {
  children: JSX.Element;
  buffer: number;
}

export function ConsoleProvider({
  children,
  buffer,
}: ConsoleProviderProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isFollow, setIsFollow] = useState(true);

  const handler = useCallback((input: string, key: Key) => {
    if (!isFocused) return;
    if (key.downArrow || key.upArrow || key.pageDown || key.pageUp) setIsFollow(false);
    if (key.downArrow) setOffset(prev => prev + 1);
    if (key.upArrow) setOffset(prev => prev - 1);
    if (key.pageDown) setOffset(prev => prev + buffer);
    if (key.pageUp) setOffset(prev => prev - buffer);
    if (input === 'f') setIsFollow(true);
  }, [isFocused]);

  useKeymap(handler);

  return (
    <ConsoleContext.Provider value={{ offset, setOffset, isFollow, setIsFollow, isFocused, setIsFocused, buffer }}>
      {children}
    </ConsoleContext.Provider>
  );
}
