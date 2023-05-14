import { Key } from 'ink';
import { createContext, useContext, useEffect } from 'react';

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

export function useKeymap(binding: Keybinding) {
  const { addBinding, removeBinding } = useContext(KeymapContext);

  useEffect(() => {
    const handle = addBinding(binding);
    return () => {
      removeBinding(handle);
    };
  }, [addBinding, removeBinding, binding]);
}
