import { useCallback, useEffect } from 'react';

export function useDisableScroll(disable: boolean, isOpen: boolean) {
    useEffect(() => {
        if (disable && isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [disable, isOpen]);

    const cleanup = useCallback(
        () => disable && (document.body.style.overflow = ''),
        [disable]
    );

    return cleanup;
}
