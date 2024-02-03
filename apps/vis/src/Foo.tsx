import { Button, Snippet } from '@ts-retype/uikit';
import { FC } from 'react';

export const Foo: FC = () => {
    return (
        <>
            <Button />
            <Snippet title="foo">Click on the Vite and React logos to learn more</Snippet>
        </>
    );
};
