import { useState } from 'react';

export function useBoolean(
    defaultValue: boolean,
): [boolean, () => void, () => void, () => void] {
    const [value, setValue] = useState(defaultValue);
    const toggle = () => setValue(prev => !prev);
    return [value, toggle, () => setValue(true), () => setValue(false)];
}
