import type { ArrayElement, TokenRoot, TypeDuplicate } from '@ts-retype/search/types';
import { Lines, TokenElement } from '@ts-retype/uikit/code';
import { highlightDefinition, highlightPhrase } from '../../model/snippet.js';
import { FC } from 'react';
import { splitLines } from '@ts-retype/search/snippet';
import { useSearchPhrase } from '@ts-retype/uikit/hooks';

const EMPTY_ROOT: TokenRoot = { type: 'root', children: [] };

export type DefinitionSnippetProps = ArrayElement<TypeDuplicate['files']> & {
  className?: string;
}

export const DefinitionSnippet: FC<DefinitionSnippetProps> = ({
    srcHgl,
    lines,
    offset,
    pos,
    className,
}) => {
    const { phrase } = useSearchPhrase();

    const code = splitLines(
        highlightPhrase(
            highlightDefinition(
                srcHgl || EMPTY_ROOT,
                { offset, pos },
            ),
            phrase,
        )
    );

    return (
        <div className={className}>
            <Lines start={lines[0]} type="lineNo">
                {code.children.map((token, idx) => (
                    <TokenElement key={idx}>{token}</TokenElement>
                ))}
            </Lines>
        </div>
    );
};
