import { createContext } from 'react';
import { TreeContextValue } from './types';

export const TreeContext = createContext<TreeContextValue>({
  onClick: () => {
    /* empty */
  },
});
