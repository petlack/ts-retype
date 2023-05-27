import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import { useMountTransition } from '~/hooks/useMountTransition';
import { StyledContainer } from '~/components/types';
import { Box } from '~/components';

function createPortalRoot() {
  const drawerRoot = document.createElement('div');
  drawerRoot.setAttribute('id', 'drawer-root');
  return drawerRoot;
}

export type DrawerProps = StyledContainer<{
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  backdropMode?: 'lighten' | 'darken';
  removeWhenClosed?: boolean;
  disableScrollingWhenOpen?: boolean;
  speed?: number;
}>

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
  const portalRootRef = useRef(
    document.getElementById('drawer-root') || createPortalRoot()
  );
  const isTransitioning = useMountTransition(isOpen, speed);

  useEffect(() => {
    bodyRef.current?.appendChild(portalRootRef.current);
    const portal = portalRootRef.current;
    const bodyEl = bodyRef.current;
    return () => {
      portal.remove();
      if (disableScrollingWhenOpen) {
        if (bodyEl && bodyEl.style) {
          bodyEl.style.overflow = '';
        }
      }
    };
  }, []);

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

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keyup', onKeyPress);
    }
    return () => {
      window.removeEventListener('keyup', onKeyPress);
    };
  }, [isOpen, onClose]);

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

        <Box
          onClick={onClose}
          sx={{
            width: '100%',
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            bg: { darken: 'rgba(0, 0, 0, 0.5)', lighten: 'rgba(255, 255, 255, 0.5)' }[backdropMode],
            // backdropFilter: 'blur(10px)',
            visibility: isTransitioning && isOpen ? 'visible' : 'hidden',
            opacity: isTransitioning && isOpen ? 1 : 0,
            transitionProperty: 'opacity,visibility',
            transition: `${speed}ms ease`,
            pointerEvents: isTransitioning && isOpen ? 'auto' : 'none',
            zIndex: isOpen ? 25 : 0,
          }}
        />
      </Box>
    </FocusTrap>,
    portalRootRef.current
  );
};

