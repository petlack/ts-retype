import { OverlayProps } from '../Overlay/Overlay.js';
import { PropsWithChildren, useMemo } from 'react';
import { clsx } from '../clsx.js';
import { createPortal } from 'react-dom';
import { useDisableScroll } from '../hooks/useDisableScroll.js';
import { useKey } from '../hooks/useKey.js';
import { usePortalTransition } from '../hooks/usePortalTransition.js';

export type DrawerProps = PropsWithChildren<OverlayProps & {
    position?: 'left' | 'right';
    removeWhenClosed?: boolean;
    disableScrollingWhenOpen?: boolean;
    speed?: number;
}>;

export const Drawer = ({
    isOpen,
    children,
    onClose,
    position = 'right',
    // backdropMode = 'darken',
    removeWhenClosed = true,
    disableScrollingWhenOpen = true,
    speed = 150,
}: DrawerProps) => {
    const cleanup = useDisableScroll(disableScrollingWhenOpen, isOpen);

    const { isTransitioning, portalRootRef } = usePortalTransition({
        portalId: 'portal-drawer',
        isVisible: isOpen,
        onRemove: cleanup,
        speed,
    });

    useKey({ key: 'Escape', handler: onClose });

    const drawerStyles = useMemo(() => clsx(
        'h-full',
        'fixed',
        'top-0',
        'z-30',
        'overflow-auto',
        'transition-transform ease-in duration-150',
        position === 'left' ? 'left-0' : 'right-0',
        isTransitioning && isOpen ?
            'translate-x-0' :
            { left: '-translate-x-105', right: 'translate-x-full' }[position],
    ), [position, isTransitioning, isOpen]);

    if (!isTransitioning && removeWhenClosed && !isOpen) {
        return null;
    }

    return createPortal(
        <div aria-hidden={isOpen ? 'false' : 'true'}>
            <div
                role="dialog"
                className={drawerStyles}>
                {children}
            </div>
            {/* <Overlay */}
            {/*     isTransitioning={isTransitioning} */}
            {/*     isOpen={isOpen} */}
            {/*     onClose={onClose} */}
            {/*     speed={speed} */}
            {/*     backdropMode={backdropMode} */}
            {/* /> */}
        </div>,
        portalRootRef.current
    );
};
