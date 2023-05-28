import { useCallback, useEffect, useRef, useState } from 'react';
import { useScreenDimensions } from './useScreenDimensions.js';
// import { useScrollPosition } from './useScrollPosition';
import { getAbsoluteBoundingBox } from './useTooltip/utils.js';

interface BoundingBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type BoundingBoxHook = {
  box: BoundingBox | null;
  ref: React.RefObject<HTMLDivElement>;
  update: () => void;
};

export function useBoundingBox(): BoundingBoxHook {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useScreenDimensions();
  // const { scrollLeft, scrollTop } = useScrollPosition();
  const [box, setBox] = useState<BoundingBox | null>(null);

  const update = useCallback(() => {
    if (ref.current) {
      // const rect = ref.current.getBoundingClientRect();
      const box = getAbsoluteBoundingBox(ref.current);
      // console.log({ rect, box });
      setBox(box);
    }
  }, [ref, setBox]);

  useEffect(() => {
    // console.log({ width, height, scrollLeft, scrollTop });
    update();
  }, [width, height]);

  return {
    box,
    update,
    ref,
  };
}
