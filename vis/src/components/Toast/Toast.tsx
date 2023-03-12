import { createContext, useContext, useState } from 'react';
import './Toast.scss';

export type ToastProps = {
  msg: string | null;
}

interface ToastContextType {
  showToast: (message: string) => void;
}

export function Toast({ msg }: ToastProps) {
  console.log('redraw', msg);
  return (
    <div className={`toast ${msg ? 'visible' : 'invisible'}`}>{msg}</div>
  );
}

export function ToastProvider({ children }: { children: JSX.Element[] }): JSX.Element {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  let handle: NodeJS.Timeout | null = null;

  function showToast(message: string) {
    if (handle) {
      clearTimeout(handle);
    }
    setToastMessage(message);
    handle = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast msg={toastMessage} />
    </ToastContext.Provider>
  );
}

export const ToastContext = createContext<ToastContextType>({ showToast: () => { /* empty */ } });

export function useToast() {
  const { showToast } = useContext(ToastContext);
  return showToast;
}