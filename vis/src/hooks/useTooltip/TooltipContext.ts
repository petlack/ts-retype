import { createContext } from 'react';
import { TooltipContextValue } from './types';

export const TooltipContext = createContext<TooltipContextValue>({
  content: null,
  position: { x: 0, y: 0 },
  isVisible: false,
  move: () => {
    /* empty */
  },
  show: () => {
    /* empty */
  },
  hide: () => {
    /* empty */
  },
  fromEvent: () => ({ x: 0, y: 0 }),
});
