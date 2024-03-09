import { createContext } from 'react';
import { TreeContextValue } from './types.js';

export const TreeContext = createContext<TreeContextValue>({
  onClick: () => {
    /* empty */
  },
  selectedId: 0,
});
