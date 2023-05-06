import { Key } from 'ink';
import { createContext, useContext } from 'react';

export type KeyHandler = () => void | Promise<void>;
export type Keybinding = (input: string, key: Key) => void;

export type KeymapContextValue = {
  addBinding: (binding: Keybinding) => number;
  removeBinding: (handle: number) => void;
  bindings: Keybinding[];
};

export const KeymapContext = createContext<KeymapContextValue>({
  addBinding() {
    return 0;
  },
  removeBinding() {
    /**/
  },
  bindings: [],
});

export function useKeymap() {
  const value = useContext(KeymapContext);
  return value;
}
