import { useCallback, useState } from 'react';
import type { ArrayElement, TypeDuplicate } from '@ts-retype/search/types';
import { Title } from './Title.js';
import { DefinitionSnippet } from './DefinitionSnippet.js';
import { Explorer, ExplorerProps } from '../Explorer/index.js';

export function Duplicate({ files, names, group }: TypeDuplicate) {
    const [selectedFile, setSelectedFile] = useState<ArrayElement<typeof files>>(files[0]);
    const onClick = useCallback<NonNullable<ExplorerProps['onClick']>>((node) => {
        if (node.data.file) {
            setSelectedFile(node.data.file);
        }
    }, [setSelectedFile]);

    return (
        <div className="grid grid-rows-[min-content_1fr] grid-cols-[30ch_1fr] border border-border rounded-md overflow-hidden bg-bg text-fg">
            <Title
                className="col-span-2"
                names={names}
                selectedFile={selectedFile}
                type={selectedFile.type}
                group={group}
            />
            <Explorer
                className="border-r border-border bg-bg-explorer text-neutral-700 text-sm"
                files={files}
                selectedFile={selectedFile}
                onClick={onClick}
            />
            <DefinitionSnippet
                {...selectedFile}
            />
        </div>
    );
}
