import { FC, PropsWithChildren } from 'react';
// import { foo } from '@ts-retype/search';

export type SnippetProps = PropsWithChildren<{
    title: string;
}>;

export const Snippet: FC<SnippetProps> = ({ children, title }) => {
    // foo();
    return (
        <div>
            <h3>{title}</h3>
            <span>bao</span>
            <pre>{children}</pre>
        </div>
    );
};
