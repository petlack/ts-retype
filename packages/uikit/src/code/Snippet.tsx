import { FC, PropsWithChildren } from 'react';

export type SnippetProps = PropsWithChildren<{
    title: string;
}>;

export const Snippet: FC<SnippetProps> = ({ children, title }) => {
    return (
        <div>
            <h3>{title}</h3>
            <pre>{children}</pre>
        </div>
    );
};
