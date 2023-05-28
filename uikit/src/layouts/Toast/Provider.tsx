// import { AnimatePresence, m as motion } from 'framer-motion';
// import { LazyMotion, domAnimation } from 'framer-motion';
import { FC, useSyncExternalStore } from 'react';
import { Stack } from '../Stack';
import { Toast } from './Toast';
import { createPortal } from 'react-dom';
import { store } from './store';
import { usePortalTransition, useAnimatePresence } from '~/hooks';

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
      {state.toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </Stack>,
    portalRootRef.current
  );
};


