import { useCallback, useEffect } from 'react';

export function useDisableScroll(disable: boolean) {
    useEffect(() => {
        if (disable) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [disable]);

    const cleanup = useCallback(
        () => disable && (document.body.style.overflow = ''),
        [disable]
    );

    return cleanup;
}
