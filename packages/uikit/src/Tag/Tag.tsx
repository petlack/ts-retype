import { FC, PropsWithChildren } from 'react';

export type TagProps = {
    tag?: string;
};

export const Tag: FC<PropsWithChildren<TagProps>> = ({ children }) => {
    return (
        <>
            <span>{children}</span>
        </>
    );
};
