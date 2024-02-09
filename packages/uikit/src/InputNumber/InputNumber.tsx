import { IconMinus, IconPlus } from '../icons.js';
import { FC } from 'react';
import { clsx } from '../clsx.js';

export type InputNumberProps = {
    onChange: (val: number) => void;
    value: number;
    max?: number;
    min?: number;
    step?: number;
} & Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'>;

export const InputNumber: FC<InputNumberProps> = ({
    className,
    max,
    min,
    onChange,
    value,
    step = 1,
    ...props
}) => {
    const clamp = (val: number) => {
        if (min && val < min) return min;
        if (max && val > max) return max;
        return val;
    };
    const inc = () => onChange(clamp(value + step));
    const dec = () => onChange(clamp(value - step));
    const parse = (val: string) => {
        if (val === '0-' || val === '-') {
            onChange(-Infinity);
        } else if (val.endsWith('-') || val.startsWith('--')) {
            onChange(min == null || -1 * value > min ? -1 * value : value);
        } else {
            const num = +val;
            if (isNaN(num)) return;
            onChange(clamp(num));
        }
    };
    const canInc = max == null || value < max;
    const canDec = min == null || value > min;

    const buttonStyle = clsx(
        'flex items-center justify-center',
        'w-8',
        'aspect-square',
        'px-1',
        'text-white',
        'bg-accent-500',
        'hover:bg-accent-600',
        'disabled:bg-neutral-300 disabled:text-neutral-50 disabled:hover:bg-neutral-200',
        'transition',
        'font-bold',
    );

    const inputStyle = clsx(
        'w-10',
        'px-2 py-1',
        'outline-none border-none',
        'text-md text-center',
        '[-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none',
        className,
    );

    return (
        <div className="flex flex-row">
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
                value={value === -Infinity ? '-' : value}
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
