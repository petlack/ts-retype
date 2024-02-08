import { FC, ReactNode } from 'react';
import { clsx } from '../clsx.js';

export const Topbar: FC<{ className: string, children: ReactNode[] }> = ({ children, className }) => {
    const topbarStyle = clsx(
        className,
        'flex flex-col',
    );
    return (
        <div className={topbarStyle}>
            <div className="h-1 bg-accent-400"></div>
            <div className="flex flex-row items-center justify-between">
                {children[0]}
                {children[1]}
            </div>
        </div>
    );
};
