import type { Metadata, TypeDuplicate } from '@ts-retype/search/types';
import { useEffect, useState } from 'react';
import { FulltextData } from '../types';
import { decompressRoot } from '@ts-retype/syhi/snippet';

function fulltext(duplicate: FulltextData): string {
    return [
        `${duplicate.names.map(({ name }) => name)}`,
        `${Object.keys(duplicate.names).join(' ')}`,
        `${duplicate.files.flatMap(({ file, src }) => [file, src]).join(' ')}`,
        `${(duplicate.properties || []).map(({ name, type }) => `${type} ${name}: ${type}`).join(' ')}`,
        `${(duplicate.parameters || []).map(({ name, type }) => `${type} ${name}: ${type}`).join(' ')}`,
        `${(duplicate.members || []).join(' ')}`,
        `${(duplicate.types || []).join(' ')}`,
    ].join(' ');
}

function decompress(td: TypeDuplicate) {
    return {
        ...td,
        files: td.files.map(file => {
            const srcHgl = decompressRoot(file.srcHgl);
            return {
                ...file,
                srcHgl,
                src: srcHgl?.children.map(s => s.value).join('') ?? '',
            };
        }),
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
        let handle: number;
        const retries = 0;
        function pollWindow() {
            /* eslint-disable no-console */
            console.log('polling data');
            if (window.__data__?.length) {
                const data = window.__data__
                    .map(decompress)
                    .filter(({ group }) => ['identical', 'renamed'].includes(group))
                    .map((duplicate, idx) => ({
                        ...duplicate,
                        id: idx,
                        fulltext: fulltext(duplicate as FulltextData),
                    }));
                setAllData(data);
                console.log('setting', data);
                setMeta(window.__meta__);
            } else {
                if (retries > 10) {
                    console.log('retries exceeded');
                    return;
                }
                console.log('waiting for data');
                console.log(window.__data__);
                handle = setTimeout(pollWindow, 1000);
            }
        }
        pollWindow();
        return () => clearTimeout(handle);
    }, []);

    return {
        data: allData,
        meta,
    };
}
