import { FC, PropsWithChildren } from 'react';
import { clsx } from '../clsx.js';

export const Code: FC<PropsWithChildren<{
    className?: string
}>> = ({
    className,
    children,
}) => {
    const codeStyle = clsx(
        'flex flex-1 flex-col',
        'whitespace-break-spaces',
        'font-mono font-medium',
        'text-md leading-normal',
        'shadow-none',
        className,
    );
    return (
        <pre className={codeStyle}>
            {children}
        </pre>
    );
};
