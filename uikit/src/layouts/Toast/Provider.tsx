import { AnimatePresence, motion } from 'framer-motion';
import { FC, useSyncExternalStore } from 'react';
import { Stack } from '../Stack';
import { Toast } from './Toast';
import { createPortal } from 'react-dom';
import { store } from './store';
import { usePortalTransition } from '~/hooks';

export const ToastProvider: FC = () => {
  const { portalRootRef } = usePortalTransition({
    portalId: 'portal-toast',
    isVisible: true,
  });
  const state = useSyncExternalStore(
    store.subscribe,
    store.getState,
    store.getState,
  );

  if (!portalRootRef || !portalRootRef.current) {
    return null;
  }

  return createPortal(
    <Stack sx={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      p: 2,
      gap: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
    }}>
      <AnimatePresence initial={false}>
        {state.toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          >
            <Toast toast={toast} />
          </motion.div>
        ))}
      </AnimatePresence>
    </Stack>,
    portalRootRef.current
  );
};


