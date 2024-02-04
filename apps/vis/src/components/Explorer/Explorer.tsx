import { indexWith, useTree, Cardinality, Pass, Ul, Tree, TreeNode, TreeProps, TreeProvider, TreeProviderProps } from '@ts-retype/uikit/tree';
import { useCallback, useMemo } from 'react';
import { ArrayElement, TypeDuplicate } from '@ts-retype/search/types';
import {
    ICON_CHEVRON_DOWN,
    ICON_CODE,
    ICON_FILE,
    ICON_FOLDER,
    IconLetter,
} from './icons.js';
import { SearchAwareText } from '@ts-retype/uikit';
import { SAT_FOUND } from '../../model/snippet.js';

type File = ArrayElement<TypeDuplicate['files']>;
type Node = {
  name: string,
  type: 'file' | 'dir' | 'type',
  selected?: boolean,
  file?: File,
};

export const FileNode: TreeNode<Node> = ({ node, children }) => {
    const { onClick } = useTree();
    const type = node.data.file?.type;
    const onClickHandler = useCallback(() => onClick(node.id), [node.id, onClick]);
    const iconMarkup = type && node.data.type === 'type' ?
        <IconLetter letter={type[0].toUpperCase()} /> :
        { file: ICON_FILE, dir: ICON_FOLDER, type: ICON_CODE }[node.data.type];
    const chevronMarkup = node.data.type === 'type' ?
        <span className="icon-empty"></span> :
        <span className="icon-chevron">{ICON_CHEVRON_DOWN}</span>;
    // const levelStyle = ['ml-1', 'ml-2', 'ml-3', 'ml-4', 'ml-5', 'ml-6', 'ml-7'][node.level];
    const levelStyle = `ml-${node.level}`;
    return (
        <>
            <span className={`flex items-center gap-x-1.5 whitespace-nowrap ${levelStyle}`} onClick={onClickHandler}>
                {chevronMarkup}
                <span>{iconMarkup}</span>
                <SearchAwareText foundClassName={SAT_FOUND}>{node.data.name}</SearchAwareText>
            </span>
            {children}
        </>
    );
};

const One: Cardinality<Node> = ({ node, children }) => {
    const { selectedId } = useTree();
    const isSelected = selectedId === node.id;
    const isHoverable = node.data.type === 'type';
    const selectedStyle = isSelected ? 'bg-accent-200' : '';
    const hoverStyle = isHoverable ? 'hover:bg-accent-50' : '';
    return (
        <li
            className={`flex flex-col cursor-pointer pr-2 ${selectedStyle} ${hoverStyle}`}
        >
            {children}
        </li>
    );
};

const Leaf: TreeNode<Node> = ({ node }) => {
    return <FileNode node={node}></FileNode>;
};

export function FileTree(props: TreeProps<Node>) {
    return (
        <Tree
            {...props}
            Self={FileTree}
            Many={Ul}
            One={One}
            Node={FileNode}
            Root={Pass}
            Leaf={Leaf}
        />
    );
}

const createIndex = indexWith(
    (item: ArrayElement<ExplorerProps['files']>) => {
        const parts = item.file.split('/');
        if (parts.length < 1) {
            return [];
        }
        const init = parts.slice(0, -1);
        const last = parts.at(-1) || '';

        return [
            ...init.map(part => ({ name: part, type: 'dir' })),
            { name: last, type: 'file' },
            { name: item.name, type: 'type', file: item },
        ] as Node[];
    },
    (part: Node) => part.file ? `${part.name} ${part.file.pos.join('-')}` : part.name,
    { name: 'anonymous', type: 'dir' },
);

export type ExplorerProps = {
  files: TypeDuplicate['files'];
  onClick?: TreeProviderProps<Node>['onClick'];
  selectedFile: ArrayElement<TypeDuplicate['files']>;
  className?: string;
};

export function Explorer({ files, selectedFile, onClick, className }: ExplorerProps) {
    const index = useMemo(() => createIndex(files), [files]);
    const selectedPath = `/${selectedFile.file}/${selectedFile.name} ${selectedFile.pos[0]}-${selectedFile.pos[1]}`;
    const selectedId = index.byPath[selectedPath]?.id;
    return (
        <div className={`${className} overflow-scroll flex p-2`}>
            <TreeProvider index={index} selectedId={selectedId} onClick={onClick}>
                <FileTree node={index.byId[0]} byId={index.byId} />
            </TreeProvider>
        </div>
    );
}
