import { FC, useState, MouseEvent } from 'react';
import { TooltipContext } from './TooltipContext';
import { TooltipContent, TooltipContextValue, TooltipPosition } from './types';
import { getAbsoluteBoundingBox } from './utils';

function fromEvent(e: MouseEvent<HTMLElement>): TooltipPosition {
  const box = getAbsoluteBoundingBox(e.currentTarget && e.currentTarget);
  return box;
}

export const TooltipProvider: FC<{ children: JSX.Element }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState<TooltipContent>(<></>);
  const [position, setPosition] = useState<TooltipPosition>({ x: 0, y: 0 });

  const show: TooltipContextValue['show'] = (content, position) => {
    setPosition(position);
    setIsVisible(true);
    setContent(content);
  };

  const hide: TooltipContextValue['hide'] = () => {
    setIsVisible(false);
    setContent(<></>);
  };

  const move: TooltipContextValue['move'] = (position) => {
    setPosition(position);
  };

  const value = {
    show,
    hide,
    move,
    isVisible,
    content,
    position,
    fromEvent,
  };

  return (
    <TooltipContext.Provider value={value}>
      {children}
    </TooltipContext.Provider>
  );
};