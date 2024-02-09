import { useCallback, useState } from 'react';
import type { ArrayElement, TypeDuplicate } from '@ts-retype/search/types';
import { Title } from './Title.js';
import { DefinitionSnippet } from './DefinitionSnippet.js';
import { Explorer, ExplorerProps } from '../Explorer/index.js';
import { clsx } from '@ts-retype/uikit/clsx';

export function Duplicate({ files, names, group }: TypeDuplicate) {
    const [selectedFile, setSelectedFile] = useState<ArrayElement<typeof files>>(files[0]);
    const onClick = useCallback<NonNullable<ExplorerProps['onClick']>>((node) => {
        if (node.data.file) {
            setSelectedFile(node.data.file);
        }
    }, [setSelectedFile]);

    const gridStyle = clsx(
        'grid grid-rows-[min-content_1fr] grid-cols-[30ch_1fr]',
        'bg-bg text-fg',
        'border border-border',
        'rounded-md',
        'overflow-hidden',
    );

    return (
        <div className={gridStyle}>
            <Title
                className="col-span-2 bg-default text-default"
                names={names}
                selectedFile={selectedFile}
                type={selectedFile.type}
                group={group}
            />
            <Explorer
                className="border-r border-neutral-300 bg-default text-default text-sm"
                files={files}
                selectedFile={selectedFile}
                onClick={onClick}
            />
            <DefinitionSnippet
                className="bg-code text-default"
                {...selectedFile}
            />
        </div>
    );
}
