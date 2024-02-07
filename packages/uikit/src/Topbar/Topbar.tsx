import { FC, ReactNode } from 'react';

export const Topbar: FC<{ children: ReactNode[] }> = ({ children }) => {
    return (
        <div className="flex flex-col">
            <div className="h-6 bg-accent-400"></div>
            <div className="border-neutral-300 border-b">{children[0]}</div>
            <div className="flex flex-1">{children[1]}</div>
        </div>
    );
};
