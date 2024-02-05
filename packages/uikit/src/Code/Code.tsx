import { FC, PropsWithChildren } from 'react';

export const Code: FC<PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
    return (
        <pre
            className={`flex-1 text-md font-mono font-medium leading-6 p-2 px-4 shadow-none flex flex-col whitespace-pre-line ${className}`}
        >{children}</pre>
    );
};
