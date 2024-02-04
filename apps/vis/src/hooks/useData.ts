import type { Metadata, TypeDuplicate } from '@ts-retype/search/types';
import { useEffect, useState } from 'react';
import { FulltextData } from '../types';
import { decompressRoot } from '@ts-retype/search/snippet';

function fulltext(duplicate: FulltextData): string {
    return [
        `${duplicate.names.map(({ name }) => name)}`,
        `${Object.keys(duplicate.names).join(' ')}`,
        `${duplicate.files.map(({ file }) => file).join(' ')}`,
        `${(duplicate.properties || []).map(({ name, type }) => `${type} ${name}: ${type}`).join(' ')}`,
        `${(duplicate.parameters || []).map(({ name, type }) => `${type} ${name}: ${type}`).join(' ')}`,
        `${(duplicate.members || []).join(' ')}`,
        `${(duplicate.types || []).join(' ')}`,
    ].join(' ');
}

function decompress(td: TypeDuplicate) {
    return {
        ...td,
        files: td.files.map(file => ({
            ...file,
            srcHgl: decompressRoot(file.srcHgl),
        })),
    };
}

export type DataType = {
    data: FulltextData[];
    meta: Metadata;
};

export function useData() {
    const [allData, setAllData] = useState([] as FulltextData[]);
    const [meta, setMeta] = useState({} as Metadata);

    useEffect(() => {
        setAllData(
            window.__data__
                .map(decompress)
                .filter(({ group }) => ['identical', 'renamed'].includes(group))
                .map((duplicate, idx) => ({
                    ...duplicate,
                    id: idx,
                    fulltext: fulltext(duplicate as FulltextData),
                }))
        );
        setMeta(window.__meta__);
    }, []);

    return {
        data: allData,
        meta,
    };
}
