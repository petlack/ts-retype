import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export function useBoolean(
    defaultValue: boolean,
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
    const [value, setValue] = useState(defaultValue);
    const toggle = useCallback(() => {
        setValue((prev) => !prev);
    }, [setValue]);
    return [value, toggle, setValue];
}
