import { ReactNode } from 'react';
import { clsx } from '../clsx.js';

export type WindowProps = {
    children: ReactNode | ReactNode[];
    theme?: 'dark' | 'light';
    header?: ReactNode | ReactNode[];
    forceHeader?: boolean;
    responsive?: boolean;
    name?: string;
}

export function Window({ name, theme = 'light', forceHeader: forceHeader = false, header, children, responsive = false }: WindowProps) {
    const iconStyle = clsx(
        'flex',
        'w-3 h-3',
        'rounded-full',
    );

    const headerMarkup = (
        <div className="flex flex-rows items-center gap-4 bg-window-header border-border rounded-t-md px-2">
            <div className="flex flex-row gap-2">
                <span className={clsx(iconStyle, 'bg-red-500')}></span>
                <span className={clsx(iconStyle, 'bg-yellow-500')}></span>
                <span className={clsx(iconStyle, 'bg-green-500')}></span>
            </div>
            <div className="name">{name}</div>
        </div>
    );

    const windowStyle = clsx(
        'window',
        theme,
        responsive ? 'window-responsive' : '',
        'bg-code text-code rounded-md border-border',
    );

    const headerVisible = forceHeader || header || name;

    return (
        <div className={windowStyle}>
            {headerVisible ? headerMarkup : null}
            {header ? header : null}
            <div className="px-4 py-2">
                {children}
            </div>
        </div>
    );
}
