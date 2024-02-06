import { FC } from 'react';
import { clsx } from '../clsx.js';

export type InputNumberProps = {
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

export const InputNumber: FC<InputNumberProps> = ({ value, onChange, min, max, step = 1 }) => {
    const clamp = (val: number) => {
        if (min && val < min) return min;
        if (max && val > max) return max;
        return val;
    };
    const inc = () => onChange(clamp(value + step));
    const dec = () => onChange(clamp(value - step));
    const buttonStyle = clsx(
        'bg-accent-400',
        'px-1',
    );
    const inputStyle = clsx(
        'w-10',
        'px-2 py-1',
        'bg-slate-300',
        'outline-none border-none',
        'text-md text-center',
        '[-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none',
    );
    return (
        <div className="flex flex-row px-2 py-1">
            <button className={buttonStyle} onClick={dec}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                </svg>
            </button>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(clamp(+e.target.value))}
                className={inputStyle}
            />
            <button className={buttonStyle} onClick={inc}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </button>
        </div>
    );
};
