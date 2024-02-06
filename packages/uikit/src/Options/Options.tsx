import { FC } from 'react';
import { UseOptionsGroup, useOptionsGroup } from '../hooks/useOptionsGroup.js';

export type OptionsProps<ValueType> = UseOptionsGroup<ValueType>;

export const Options: FC<OptionsProps<string>> = ({ name, options, onChange }) => {
    const { containerProps, labelProps, itemProps, selectedOptionIdx } = useOptionsGroup<string>({ name, options, onChange });
    return (
        <div {...containerProps}>
            <label {...labelProps}>{name}</label>
            {options.map((option, idx) => (
                <div key={option} {...itemProps(idx)}>
                    {selectedOptionIdx === idx ? `* ${option}`: option}
                </div>
            ))}
        </div>
    );
};
