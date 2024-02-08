import { splitLines } from '@ts-retype/search/snippet';
import { Lines, TokenElement } from '@ts-retype/uikit/code';
import { useSearchPhrase } from '@ts-retype/uikit/hooks';
import { highlightDefinition, highlightPhrase } from '../../model/snippet.js';
import type { ArrayElement, TokenRoot, TypeDuplicate } from '@ts-retype/search/types';

const EMPTY_ROOT: TokenRoot = { type: 'root', children: [] };

export type DefinitionSnippetProps = ArrayElement<TypeDuplicate['files']> & {
  className?: string;
}

export function DefinitionSnippet({ srcHgl, lines, offset, pos, className }: DefinitionSnippetProps) {
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
        <Lines start={lines[0]} type="lineNo" className={className}>
            {code.children.map((token, idx) => (
                <TokenElement key={idx}>{token}</TokenElement>
            ))}
        </Lines>
    );
}
