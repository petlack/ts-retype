import { FC, PropsWithChildren } from 'react';

export const Code: FC<PropsWithChildren> = ({ children }) => {
    return (
        <pre
            className="flex-1 text-neutral-900 text-md font-mono font-medium leading-6 p-2 px-4 bg-transparent shadow-none flex flex-col whitespace-pre-line"
        >{children}</pre>
    );
};
