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
    const headerVisible = forceHeader || header || name;

    const iconStyle = clsx(
        'flex',
        'w-3 h-3',
        'rounded-full',
    );

    const windowStyle = clsx(
        'window',
        theme,
        responsive ? 'window-responsive' : null,
        'bg-code text-code rounded-md border-border',
    );

    const headerMarkup = (
        <div className={clsx(
            'flex flex-row items-center',
            'px-2 py-1 gap-4',
            'bg-window-header text-window-header',
            'font-bold',
            'border-border',
            'rounded-t-md',
            'cursor-default',
        )}>
            <div className="flex flex-row gap-2">
                <span className={clsx(iconStyle, 'bg-neutral-300')}></span>
                <span className={clsx(iconStyle, 'bg-neutral-500')}></span>
                <span className={clsx(iconStyle, 'bg-neutral-400')}></span>
            </div>
            <div className="min-h-[1rem]">
                {name}
            </div>
        </div>
    );

    return (
        <div className={windowStyle}>
            {header ?? (headerVisible && headerMarkup)}
            <div className="px-8 py-6">
                {children}
            </div>
        </div>
    );
};
