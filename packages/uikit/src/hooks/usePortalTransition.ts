import { useRef, useLayoutEffect } from 'react';
import { useMountTransition } from './useMountTransition.js';

function createPortalRoot(portalId: string) {
    const drawerRoot = document.createElement('div');
    drawerRoot.setAttribute('id', portalId);
    return drawerRoot;
}

export type UseTransitionProps = {
  isVisible: boolean;
  portalId: string;
  speed?: number;
  onRemove?: () => void;
};

export function usePortalTransition({
    isVisible,
    portalId,
    onRemove,
    speed = 300,
}: UseTransitionProps) {
    const bodyRef = useRef(document.querySelector('body'));
    const portalRootRef = useRef(document.getElementById(portalId) || createPortalRoot(portalId));
    const isTransitioning = useMountTransition(isVisible, speed);

    useLayoutEffect(() => {
        bodyRef.current?.appendChild(portalRootRef.current);
        const portal = portalRootRef.current;
        return () => {
            onRemove?.();
            portal.remove();
        };
    }, [onRemove]);

    return {
        isTransitioning,
        portalRootRef,
    };
}
