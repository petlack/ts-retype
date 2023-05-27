import { useCallback, useState } from 'react';

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const getTriggerProps = useCallback(() => {
    return {
      onClick: () => {
        toggle();
      },
    };
  }, [isOpen]);
  const getModalProps = useCallback(() => {
    return {
      opacity: isOpen ? 1 : 0,
    };
  }, [isOpen]);
  const open = useCallback(() => setIsOpen(true), [setIsOpen]);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [setIsOpen]);
  return { isOpen, open, close, toggle, getTriggerProps, getModalProps };
}
