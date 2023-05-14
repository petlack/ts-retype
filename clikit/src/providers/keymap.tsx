import React, { useState, useCallback } from 'react';
import { Keybinding, KeymapContext } from '../hooks/useKeymap.js';
import { useInput } from 'ink';

export type KeymapProviderProps = {
  children: JSX.Element;
  bindings: Keybinding[];
}

export function KeymapProvider({
  children,
  bindings: initialBindings,
}: KeymapProviderProps) {
  const [bindings, setBindings] = useState(new Map<number, Keybinding>(initialBindings.map((fn, idx) => ([ idx, fn ]))));
  let currentIdx = initialBindings.length;
  
  const addBinding = useCallback((binding: Keybinding) => {
    setBindings(prev => prev.set(currentIdx, binding));
    currentIdx++;
    return currentIdx - 1;
  }, [currentIdx, setBindings]);

  const removeBinding = useCallback((handle: number) => {
    setBindings(prev => { prev.delete(handle); return prev; });
  }, [currentIdx, setBindings]);

  const handleInput = useCallback<Keybinding>((input, key) => {
    for (const binding of bindings.values()) {
      try {
        binding(input, key);
      } catch (e) {
        continue;
      }
    }
  }, [bindings]);

  useInput(handleInput);
  
  return (
    <KeymapContext.Provider value={{ bindings: [...bindings.values()], addBinding, removeBinding }}>
      {children}
    </KeymapContext.Provider>
  );
}
