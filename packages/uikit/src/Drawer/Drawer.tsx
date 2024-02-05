import { Overlay, OverlayProps } from '../Overlay/Overlay.js';
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { usePortalTransition } from '../hooks/usePortalTransition.js';
import { useKey } from '../hooks/useKey.js';
import { createPortal } from 'react-dom';

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
    backdropMode = 'darken',
    removeWhenClosed = true,
    disableScrollingWhenOpen = true,
    speed = 150,
}: DrawerProps) => {
    const bodyRef = useRef(document.querySelector('body'));
    const cleanup = useCallback(() => {
        const bodyEl = bodyRef.current;
        if (disableScrollingWhenOpen && bodyEl && bodyEl.style) {
            bodyEl.style.overflow = '';
        }
    }, [disableScrollingWhenOpen]);
    const { isTransitioning, portalRootRef } = usePortalTransition({
        portalId: 'portal-drawer',
        isVisible: isOpen,
        onRemove: cleanup,
        speed,
    });

    useEffect(() => {
        const updatePageScroll = () => {
            if (!bodyRef.current) {
                return;
            }
            if (isOpen) {
                bodyRef.current.style.overflow = 'hidden';
            } else {
                bodyRef.current.style.overflow = '';
            }
        };
        if (disableScrollingWhenOpen) {
            updatePageScroll();
        }
    }, [isOpen, disableScrollingWhenOpen]);

    useKey({ key: 'Escape', handler: onClose });

    if (!isTransitioning && removeWhenClosed && !isOpen) {
        return null;
    }

    return createPortal(
        <div aria-hidden={isOpen ? 'false' : 'true'}>
            <div
                role="dialog"
                style={{
                    height: '100%',
                    position: 'fixed',
                    top: 0,
                    left: position === 'left' ? 0 : undefined,
                    right: position === 'right' ? 0 : undefined,
                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
                    transitionProperty: 'transform',
                    transition: `${speed}ms ease`,
                    transform: isTransitioning && isOpen ? 'translateX(0)' : { left: 'translateX(-105%)', right: 'translateX(100%)' }[position],
                    overflow: 'auto',
                    zIndex: 30,
                }}>
                {children}
            </div>
            <Overlay
                isTransitioning={isTransitioning}
                isOpen={isOpen}
                onClose={onClose}
                speed={speed}
                backdropMode={backdropMode}
            />
        </div>,
        portalRootRef.current
    );
};
