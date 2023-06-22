import { FC, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import FocusLock from 'react-focus-lock';
import { Box } from 'theme-ui';
import { Button } from '~/components/Button';
import { StyledContainer } from '~/components/types';
import { useKey, usePortalTransition } from '~/hooks';
import { Overlay, OverlayProps } from '../Overlay';

export const Modal: FC<StyledContainer & OverlayProps> = ({
  children,
  isOpen,
  onClose,
  sx,
  speed = 100,
  backdropMode = 'darken',
}) => {
  const nodeRef = useRef(null);
  const { isTransitioning, portalRootRef } = usePortalTransition({ portalId: 'portal-modal', isVisible: isOpen, speed });
  useKey({ key: 'Escape', handler: onClose });

  if (!isTransitioning && !isOpen) {
    return null;
  }

  return createPortal(
    <FocusLock disabled={!isOpen}>
      <Box
        ref={nodeRef}
        aria-hidden={isOpen ? 'false' : 'true'}
        sx={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Box sx={{
          position: 'relative',
          transitionProperty: 'transform,opacity',
          transition: `${speed}ms ease`,
          opacity: isOpen ? 1 : 0,
          transform: isTransitioning && isOpen ? 'scale(1)' : 'scale(0.9)',
          ...sx,
        }}>
          <Button
            onClick={onClose}
            leftIcon={<FaTimes />}
            tx={{ fill: 'ghost' }}
            sx={{ position: 'absolute', right: 0, top: 0 }} />
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
    </FocusLock>,
    portalRootRef.current,
  );
};

