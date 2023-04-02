import { MouseEvent } from 'react';

export type TooltipContent = JSX.Element | string | number | null;
export type TooltipPosition = {
  x: number;
  y: number;
};

export type TooltipContextValue = {
  show: (content: TooltipContent, position: TooltipPosition) => void;
  hide: () => void;
  move: (position: TooltipPosition) => void;
  content: TooltipContent;
  position: TooltipPosition;
  isVisible: boolean;
  fromEvent: (e: MouseEvent<HTMLElement>) => TooltipPosition;
};
