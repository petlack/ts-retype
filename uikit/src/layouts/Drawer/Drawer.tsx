import { useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import { StyledContainer } from '~/components/types';
import { Box } from '~/components';
import { Overlay, OverlayProps } from '../Overlay';
import { useKey, usePortalTransition } from '~/hooks';

export type DrawerOwnProps = OverlayProps & {
  position?: 'left' | 'right';
  removeWhenClosed?: boolean;
  disableScrollingWhenOpen?: boolean;
  speed?: number;
}

export type DrawerProps = StyledContainer<DrawerOwnProps>;

export const Drawer = ({
  isOpen,
  children,
  onClose,
  position = 'right',
  backdropMode = 'darken',
  removeWhenClosed = true,
  disableScrollingWhenOpen = false,
  speed = 200,
}: DrawerProps) => {
  const bodyRef = useRef(document.querySelector('body'));
  const cleanup = useCallback(() => {
    const bodyEl = bodyRef.current;
    if (disableScrollingWhenOpen && bodyEl && bodyEl.style) {
      bodyEl.style.overflow = '';
    }
  }, []);
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
  }, [isOpen]);

  useKey({ key: 'Escape', handler: onClose });

  if (!isTransitioning && removeWhenClosed && !isOpen) {
    return null;
  }

  return createPortal(
    <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true }}>
      <Box
        aria-hidden={isOpen ? 'false' : 'true'}
        sx={{ bg: 'none' }}
      >

        <Box
          role="dialog"
          sx={{
            height: '100%',
            position: 'fixed',
            top: 0,
            left: position === 'left' ? 0 : undefined,
            right: position === 'right' ? 0 : undefined,
            bg: 'none',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
            transitionProperty: 'transform',
            transition: `${speed}ms ease`,
            transform: isTransitioning && isOpen ? 'translateX(0)' : { left: 'translateX(-105%)', right: 'translateX(100%)' }[position],
            overflow: 'auto',
            zIndex: 30,
          }}>
          {children}
        </Box>

        <Overlay
          isTransitioning={isTransitioning}
          isOpen={isOpen}
          onClose={onClose}
          speed={speed}
          backdropMode={backdropMode}
        />
      </Box>
    </FocusTrap>,
    portalRootRef.current
  );
};

