import { useState } from 'react';

export type UseBoolean = {
    value: boolean;
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
}

export function useBoolean(
    defaultValue: boolean,
): UseBoolean {
    const [value, setValue] = useState(defaultValue);
    return {
        value,
        toggle() {
            setValue(prev => !prev);
        },
        setTrue() {
            setValue(true);
        },
        setFalse() {
            setValue(false);
        },
    };
}
