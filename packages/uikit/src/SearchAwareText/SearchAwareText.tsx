import { useSearchPhrase } from '../hooks/useSearchPhrase.js';

import { FC, PropsWithChildren } from 'react';

function findSubstringIndex(str: string, substr: string): [number, number] | null {
    if (!substr || !substr.length) {
        return null;
    }
    const startIdx = str.indexOf(substr);
    if (startIdx === -1) {
        return null;
    }
    const endIdx = startIdx + substr.length - 1;
    return [startIdx, endIdx];
}

export type SearchAwareTextProps = {
  foundClassName: string;
  className?: string;
}

export const SearchAwareText: FC<PropsWithChildren<SearchAwareTextProps>> = ({
    foundClassName,
    className,
    children,
}) => {
    const { phrase } = useSearchPhrase();
    const text = (children || '').toString();
    const match = findSubstringIndex(text.toLowerCase(), phrase.toLowerCase());
    if (!match) {
        return <>{text}</>;
    }
    const [start, end] = match;
    const left = text.substring(0, start);
    const found = text.substring(start, end + 1);
    const right = text.slice(end + 1);
    return (
        <>
            <span>{left}</span>
            <span className={[foundClassName, className].join(' ')}>{found}</span>
            <span>{right}</span>
        </>
    );
};
