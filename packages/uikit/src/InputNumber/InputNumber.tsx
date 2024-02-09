import { IconMinus, IconPlus } from '../icons.js';
import { FC, useMemo } from 'react';
import { clsx } from '../clsx.js';

export type InputNumberProps = React.HTMLAttributes<HTMLInputElement> & {
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    step?: number;
};

export const InputNumber: FC<InputNumberProps> = ({ value, onChange, min, max, step = 1, ...props }) => {
    const clamp = (val: number) => {
        if (min && val < min) return min;
        if (max && val > max) return max;
        return val;
    };
    const inc = () => onChange(clamp(value + step));
    const dec = () => onChange(clamp(value - step));
    const parse = (val: string) => {
        const num = +val;
        if (isNaN(num)) return;
        onChange(clamp(num));
    };
    const canInc = max == null || value < max;
    const canDec = min == null || value > min;

    console.log({ value, canInc, canDec, min, max });
    const buttonStyle = clsx(
        'flex items-center justify-center',
        'w-8',
        'aspect-square',
        'px-1',
        'text-white',
        'bg-accent-500',
        'hover:bg-accent-600',
        'disabled:bg-neutral-200 disabled:text-neutral-50 disabled:hover:bg-neutral-200',
        'transition',
        'font-bold',
    );
    const inputStyle = clsx(
        'w-10',
        'px-2 py-1',
        // 'bg-default',
        'outline-none border-none',
        'text-md text-center',
        '[-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none',
    );
    return (
        <div className="flex flex-row px-2 py-1">
            <button
                onClick={dec}
                className={clsx(
                    buttonStyle,
                    'rounded-l-md',
                )}
                disabled={!canDec}
            >
                <IconMinus size={32} />
            </button>
            <input
                type="text"
                value={value}
                onChange={e => typeof e === 'number' ? e : parse(e.currentTarget.value)}
                onKeyDown={(e) => e.key === 'ArrowUp' ? inc() : e.key === 'ArrowDown' ? dec() : null}
                className={inputStyle}
                {...props}
            />
            <button
                onClick={inc}
                className={clsx(
                    buttonStyle,
                    'rounded-r-md',
                )}
                disabled={!canInc}
            >
                <IconPlus size={32} />
            </button>
        </div>
    );
};
