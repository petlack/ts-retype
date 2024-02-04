import { ButtonHTMLAttributes, FC, PropsWithChildren, ReactNode, forwardRef } from 'react';
import { Spinner } from '../Spinner/index.js';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & PropsWithChildren<{
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}>

export const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    leftIcon,
    rightIcon,
    disabled,
    isLoading,
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

    const style = `
        ${disabledOrLoading ? 'cursor-not-allowed' : ''}
        ${isLoading ? 'opacity-50' : ''}
        ${'bg-yellow-500 text-white'}
        flex items-center justify-center px-2`;
    return (
        <button ref={ref} disabled={disabledOrLoading} className={style} {...buttonProps}>
            {markup}
        </button>
    );
});
