import { clsx } from '../clsx.js';

export type WindowProps = {
    children: JSX.Element | JSX.Element[];
    header?: JSX.Element | JSX.Element[];
    showHeader?: boolean;
    responsive?: boolean;
    theme: 'dark' | 'light';
    name: string;
}

export function Window({ name, theme, showHeader = true, header, children, responsive = false }: WindowProps) {
    const iconStyle = clsx(
        'flex',
        'w-3 h-3',
        'rounded-full',
    );

    const headerMarkup = (
        <div className="flex flex-rows items-center gap-4 bg-window-header border-border border-b">
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
        'bg-code rounded-md border-border',
    );

    return (
        <div className={windowStyle}>
            {showHeader ? headerMarkup : <></>}
            {header ? header : <></>}
            <div className="content">
                {children}
            </div>
        </div>
    );
}
