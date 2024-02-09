import { FC, ReactNode } from 'react';
import { clsx } from '../clsx.js';

export type WindowProps = {
    children: ReactNode | ReactNode[];
    theme?: 'dark' | 'light';
    header?: ReactNode | ReactNode[];
    forceHeader?: boolean;
    responsive?: boolean;
    name?: string;
}

export const Window: FC<WindowProps> = ({ 
    children,
    name,
    header,
    theme = 'light',
    forceHeader = false,
    responsive = false,
}) => {
    const iconStyle = clsx(
        'flex',
        'w-3 h-3',
        'rounded-full',
    );

    const headerMarkup = (
        <div className={clsx(
            'flex flex-row items-center',
            'px-2 py-1 gap-4',
            'bg-window-header text-window-header',
            'border-border',
            'rounded-t-md',
        )}>
            <div className="flex flex-row gap-2">
                <span className={clsx(iconStyle, 'bg-red-500')}></span>
                <span className={clsx(iconStyle, 'bg-yellow-500')}></span>
                <span className={clsx(iconStyle, 'bg-green-500')}></span>
            </div>
            <div className="min-h-[1rem]">{name}</div>
        </div>
    );

    const windowStyle = clsx(
        'window',
        theme,
        responsive ? 'window-responsive' : null,
        'bg-code text-code rounded-md border-border',
    );

    const headerVisible = forceHeader || header || name;

    return (
        <div className={windowStyle}>
            {header ? header : headerVisible ? headerMarkup : null}
            <div className="px-4 py-2">
                {children}
            </div>
        </div>
    );
};
