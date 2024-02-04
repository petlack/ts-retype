import { Snippet } from '@ts-retype/uikit';
import type { Metadata, TypeDuplicate } from '@ts-retype/search/types';
import { decompressRoot } from '@ts-retype/search/snippet';
import { useEffect, useState } from 'react';
import './App.css';

export type FulltextData = TypeDuplicate & { id: number; fulltext: string };

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

function App() {
    const [allData, setAllData] = useState([] as FulltextData[]);
    const [meta, setMeta] = useState({} as Metadata);

    useEffect(() => {
        setAllData(
            window.__data__.map(decompress).filter(({ group }) => ['identical', 'renamed'].includes(group))
                .map((duplicate, idx) => ({
                    ...duplicate,
                    id: idx,
                    fulltext: fulltext(duplicate as FulltextData),
                }))
        );
        setMeta(window.__meta__);
    }, []);


    return (
        <>
            <Snippet title="Meta">{JSON.stringify(meta)}</Snippet>
            <Snippet title="Data">{JSON.stringify(allData)}</Snippet>
        </>
    );
}

export default App;
