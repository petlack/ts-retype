import { createContext, useContext } from 'react';

export type ToastProps = {
  msg: string | null;
}

export type ToastMessage = {
  msg: string;
  kind?: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: ToastMessage) => void;
}

export const ToastContext = createContext<ToastContextType>({ showToast: () => { /* empty */ } });

export function useToast() {
    const { showToast } = useContext(ToastContext);
    return showToast;
}
