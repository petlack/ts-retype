import { ButtonHTMLAttributes, FC, PropsWithChildren, ReactNode, forwardRef } from 'react';
import { Spinner } from '../Spinner/index.js';
import { clsx } from '../clsx.js';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & PropsWithChildren<{
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    isLoading?: boolean;
    href?: string;
}>

export const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    leftIcon,
    rightIcon,
    disabled,
    isLoading,
    className,
    ...buttonProps
}, ref) => {
    const disabledOrLoading = disabled || isLoading;
    const markup = (
        <>
            {isLoading ? <Spinner flavor='ring' /> : leftIcon}
            {children}
            {rightIcon}
        </>
    );

    const style = clsx(
        disabledOrLoading ? 'cursor-not-allowed' : '',
        isLoading ? 'opacity-50' : '',
        'flex items-center justify-center',
        'bg-accent-500 text-white',
        'rounded-md px-4 py-2 gap-4',
        'transition-colors duration-200 ease-in-out',
        'hover:bg-accent-600',
    );
    return (
        <button ref={ref} disabled={disabledOrLoading} className={`${style} ${className}`} {...buttonProps}>
            {markup}
        </button>
    );
});
