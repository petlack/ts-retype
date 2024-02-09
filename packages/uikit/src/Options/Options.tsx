import { FC } from 'react';
import { UseOptionsGroup, useOptionsGroup } from '../hooks/useOptionsGroup.js';
import { clsx } from '../clsx.js';

export type OptionsProps<ValueType> = UseOptionsGroup<ValueType> & {
    className?: string;
    optionClassName?: string;
    selectedOptionClassName?: string;
};

export const Options: FC<OptionsProps<string>> = ({
    className,
    name,
    onChange,
    optionClassName,
    options,
    selectedOptionClassName,
}) => {
    const { containerProps, itemProps, selectedOptionIdx } = useOptionsGroup<string>({ name, options, onChange });
    return (
        <div {...containerProps} className={className}>
            {options.map((option, idx) => (
                <div
                    key={option}
                    {...itemProps(idx)}
                    className={clsx(
                        selectedOptionIdx === idx ? selectedOptionClassName : optionClassName,
                    )}
                >{option}</div>
            ))}
        </div>
    );
};
