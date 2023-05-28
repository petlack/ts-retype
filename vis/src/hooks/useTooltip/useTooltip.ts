import { MouseEvent, useContext, useState } from 'react';
import { TooltipContext } from './TooltipContext.js';
import { TooltipContent, TooltipContextValue, TooltipPosition } from './types.js';
import { getAbsoluteBoundingBox } from './utils.js';

export function useGlobalTooltip(): TooltipContextValue {
  const context = useContext(TooltipContext);
  return context;
}

function fromEvent(e: MouseEvent<HTMLElement>): TooltipPosition {
  const box = getAbsoluteBoundingBox(e.currentTarget && e.currentTarget);
  return box;
}

export function useTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ x: 0, y: 0 });

  const show = (position: TooltipPosition) => {
    setPosition(position);
    setIsVisible(true);
  };

  const hide: TooltipContextValue['hide'] = () => {
    setIsVisible(false);
  };

  const move: TooltipContextValue['move'] = (position) => {
    setPosition(position);
  };

  const value = {
    show,
    hide,
    move,
    isVisible,
    position,
    fromEvent,
  };

  return value;
}
