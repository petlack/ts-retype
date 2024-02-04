import { FC, PropsWithChildren } from 'react';

export type TooltipProps = {
    tag?: string;
};

export const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({ children }) => {
    return (
        <>
            <span>{children}</span>
        </>
    );
};
