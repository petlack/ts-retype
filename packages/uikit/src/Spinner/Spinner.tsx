import { FC, PropsWithChildren } from 'react';

export type SpinnerProps = {
    flavor?: string;
};

export const Spinner: FC<PropsWithChildren<SpinnerProps>> = ({ children }) => {
    return (
        <>
            <span>{children}</span>
        </>
    );
};
