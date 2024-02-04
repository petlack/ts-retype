import { createContext } from 'react';
import { MouseEvent, useContext, useState } from 'react';

type TooltipContent = JSX.Element | string | number | null;
type TooltipPosition = {
  x: number;
  y: number;
};

type TooltipContextValue = {
  show: (content: TooltipContent, position: TooltipPosition) => void;
  hide: () => void;
  move: (position: TooltipPosition) => void;
  content: TooltipContent;
  position: TooltipPosition;
  isVisible: boolean;
  fromEvent: (e: MouseEvent<HTMLElement>) => TooltipPosition;
};

const TooltipContext = createContext<TooltipContextValue>({
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

function getAbsoluteBoundingBox(node: HTMLElement): DOMRect {
    const rect = node.getBoundingClientRect();
    const x = rect.left;
    const y = rect.top;
    const width = rect.width;
    const height = rect.height;
    return new DOMRect(x, y, width, height);
}
