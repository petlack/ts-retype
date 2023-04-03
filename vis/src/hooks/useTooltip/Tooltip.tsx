import { useGlobalTooltip, useTooltip } from './useTooltip';
import { FC, MouseEvent, useCallback, HTMLAttributes, useMemo, useEffect, ReactNode, ReactElement } from 'react';
import { TooltipContent, TooltipPosition } from './types';
import { useBoundingBox } from '../useBoundingBox';
import { useScreenDimensions } from '../useScreenDimensions';
import './Tooltip.scss';
import { getAbsoluteBoundingBox } from './utils';
import { TooltipPortal } from './TooltipRoot';

function fromEvent(e: MouseEvent<HTMLElement>): TooltipPosition {
  const box = getAbsoluteBoundingBox(e.currentTarget);
  return box;
}

export const Tooltip: FC<{ children: [ReactElement<HTMLElement>, ReactElement<HTMLElement>] }> = ({ children }) => {
  // const global = useGlobalTooltip();
  const { show, hide, move, isVisible, position } = useTooltip();
  const { box, ref, update } = useBoundingBox();
  const { width, height } = useScreenDimensions();

  const [trigger, tooltip] = children;
  
  const cap = useMemo<TooltipPosition>(() => {
    if (!box) {
      return { x: 0, y: 0 };
    }
    // const { x, y } = position;
    const ideal = {
      x: position.x,
      y: position.y - box.height,
    };

    if (ideal.x + box.width > width) {
      ideal.x = width - box.width;
    }
    // const x = position.x + box.width > width ? width - box.width : position.x;
    // const y = position.y + box.height > height ? height - box.height : position.y;
    const { x, y } = ideal;
    return {
      x, y,
    };
  }, [box, position, width, height]);

  useEffect(() => {
    update();
  }, [isVisible, position]);

  const onMouseEnter = useCallback((e: MouseEvent<HTMLElement>) => {
    show(fromEvent(e));
  }, [show, box, position]);
  const onMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    move(fromEvent(e));
  }, [move]);
  const onMouseLeave = useCallback(() => hide(), [hide]);

  const tooltipMarkup = useMemo(() => (
    <div
      className={`content content--${isVisible ? 'visible' : 'invisible'}`}
      style={{ top: cap.y, left: cap.x }}
    >
      <div
        className='content-tooltip'
        ref={ref}
      >
        {tooltip}
      </div>
      {/* {JSON.stringify(cap)} */}
    </div>
  ), [tooltip, ref, cap]);

  return (
    <div className="flex tooltip">
      <div
        className="flex"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      >{trigger}</div>
      {TooltipPortal(tooltipMarkup)}
    </div>
  );
};

// const Span: FC<HTMLAttributes<HTMLSpanElement> & { alt: TooltipContent }> = ({ alt, children, ...props }) => {
//   const tooltip = useTooltip();
//   const onMouseEnter = useCallback((e: MouseEvent<HTMLElement>) => {
//     show(fromEvent(e));
//   }, [tooltip, alt]);
//   const onMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
//     move(fromEvent(e));
//   }, [tooltip, alt]);
//   const onMouseLeave = hide;
//   return (
//     <span
//       {...props}
//       onMouseEnter={onMouseEnter}
//       onMouseLeave={onMouseLeave}
//       onMouseMove={onMouseMove}
//     >{children}</span>
//   );
// };

// Tooltip.span = span;
