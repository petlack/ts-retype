import { FC, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import { Box } from 'theme-ui';
import { Button } from '~/components';
import { StyledContainer } from '~/components/types';
import { useKey, usePortalTransition } from '~/hooks';
import { Overlay, OverlayProps } from '../Overlay';

export const Modal: FC<StyledContainer & OverlayProps> = ({
  children,
  isOpen,
  onClose,
  sx,
  speed = 300,
  backdropMode = 'darken',
}) => {
  const nodeRef = useRef(null);
  const { isTransitioning, portalRootRef } = usePortalTransition({ portalId: 'portal-modal', isVisible: isOpen });
  useKey({ key: 'Escape', handler: onClose });

  if (!isTransitioning && !isOpen) {
    return null;
  }

  return createPortal(
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
        <Button onClick={onClose} leftIcon={<FaTimes />} fill='ghost' sx={{ position: 'absolute', right: 0, top: 0 }} />
        {children}
      </Box>
      <Overlay
        isTransitioning={isTransitioning}
        isOpen={isOpen}
        onClose={onClose}
        speed={speed}
        backdropMode={backdropMode}
      />
    </Box >,
    portalRootRef.current,
  );
};

// function Modal({ children, isOpen, handleClose }) {
//   return (
//     <ReactPortal wrapperId="react-portal-modal-container">
//       <CSSTransition
//         in={isOpen}
//         timeout={{ entry: 0, exit: 300 }}
//         unmountOnExit
//         classNames="modal"
//         nodeRef={nodeRef}
//       >
//         <div className="modal" ref={nodeRef}>
//           <button onClick={handleClose} className="close-btn">
//             Close
//           </button>
//           <div className="modal-content">{children}</div>
//         </div>
//       </CSSTransition>
//     </ReactPortal>
//   );
// }
// export default Modal;
