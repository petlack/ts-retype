import { useState } from 'react';
import type { ArrayElement, TypeDuplicate } from '@ts-retype/search/types';
import { Title } from './Title.js';
import { DefinitionSnippet } from './DefinitionSnippet.js';
// import { Explorer, ExplorerProps } from '../Explorer/index.js';

export function Duplicate({ files, names, group }: TypeDuplicate) {
    const [selectedFile, _setSelectedFile] = useState<ArrayElement<typeof files>>(files[0]);
    // const onClick = useCallback<NonNullable<ExplorerProps['onClick']>>((node) => {
    //     if (node.data.file) {
    //         setSelectedFile(node.data.file);
    //     }
    // }, [setSelectedFile]);

    return (
        <div className="duplicate">
            <Title names={names} selectedFile={selectedFile} type={selectedFile.type} group={group} />
            <DefinitionSnippet {...selectedFile} />
            {/* <Explorer files={files} selectedFile={selectedFile} onClick={onClick} /> */}
        </div>
    );
}
