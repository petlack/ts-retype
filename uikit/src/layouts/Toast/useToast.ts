import { useCallback } from 'react';
import { store, ToastMessage } from './store';

export function useToast() {
  const createToast = useCallback((toast: ToastMessage) => {
    store.add(toast);
  }, []);

  return createToast;
}
