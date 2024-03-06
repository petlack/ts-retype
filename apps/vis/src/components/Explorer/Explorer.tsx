import type { ArrayElement, TypeDuplicate } from '@ts-retype/search/types';
import {
    Cardinality,
    Pass, Ul,
    TreeNode as TreeNodeElement, TreeProps, TreeProvider, TreeProviderProps, Tree as TreeElement,
    useTree,
} from '@ts-retype/uikit/tree';
import {
    IconChevronDown,
    IconCode,
    IconFile,
    IconFolder,
    IconLetter,
} from './icons.js';
import { useCallback, useMemo } from 'react';
import { SearchAwareText } from '@ts-retype/uikit';
import { Separator, Tree, TreeNode } from '@ts-retype/utils/tree';
import { SAT_FOUND } from '../../model/snippet.js';

type Node = {
    name: string,
    type: 'file' | 'dir' | 'type',
    selected?: boolean,
    file?: ArrayElement<TypeDuplicate['files']>,
};

export type ExplorerProps = {
    files: TypeDuplicate['files'];
    onClick?: TreeProviderProps<Node>['onClick'];
    selectedFile: Node['file'];
    className?: string;
};

const NodeSeparator: Separator<Node> = {
    join(...parts) {
        const init = parts.slice(0, -1);
        const last = parts.at(-1);
        if (!last) return parts[0];
        return {
            name: Tree.Slash.join(...init.map(n => n.name).concat([last.name])),
            type: last?.type,
        };
    },
    split(a) {
        const [head, ...tail] = Tree.Slash.split(a.name);
        if (tail.length === 0) {
            return [{ name: head, type: a.type }];
        }
        return [
            { name: head, type: 'dir' },
            ...tail.map(name => ({ name, type: a.type })),
        ];
    },
    equal(left, right) {
        return left.name === right.name;
    },
    display(a) {
        let str = '';
        switch (a.type) {
        case 'dir':
            str = a.name + '/';
            break;
        case 'file':
        case 'type':
            str = a.name;
            break;
        }
        if (a.file) {
            str = `${str} 🟢`;
        }
        return str;
    },
};

export function Explorer({ files, onClick, className }: ExplorerProps) {
    const index = useMemo(() => {
        const rootNode: Node = { name: '.', type: 'dir' };
        function mapFileToNodes(file: ArrayElement<ExplorerProps['files']>): Node[] {
            const parts = file.file.split('/');
            if (parts.length < 1) {
                return [];
            }
            const init = parts.slice(0, -1);
            const last = parts.at(-1) || '';
            const nodes = [
                ...init.map(part => ({ name: part, type: 'dir' })),
                { name: last, type: 'file' },
                { name: file.name, type: 'type', info: file },
            ] as Node[];
            return nodes;
        }
        const nodes = files.map(mapFileToNodes);
        let tree = Tree.withRoot(rootNode);
        for (const node of nodes) {
            const file = node.at(-1);
            if (!file) continue;
            const path = node.slice(0, -1);
            tree = tree.insertNodeAtPath(file, [rootNode, ...path], NodeSeparator);
        }
        return tree;
    }, [files]);
    const selectedId = 0;
    return (
        <div className={`${className} overflow-scroll flex p-2`}>
            <TreeProvider index={index} selectedId={selectedId} onClick={onClick}>
                <FileTree nodeId={index.root().id} byId={index} />
            </TreeProvider>
        </div>
    );
}

const FileNode: TreeNodeElement<TreeNode<Node>> = ({ node, children }) => {
    const { onClick } = useTree();
    const type = node.data.file?.type;
    const onClickHandler = useCallback(() => onClick(node.id), [node.id, onClick]);
    const iconStyle = 'w-4 h-4';
    const iconMarkup = type && node.data.type === 'type' ?
        <IconLetter letter={type[0].toUpperCase()} /> :
        { file: <IconFile />, dir: <IconFolder />, type: <IconCode /> }[node.data.type];
    const chevronMarkup = node.data.type === 'type' ?
        <span className={iconStyle}></span> :
        <span className={iconStyle}><IconChevronDown size={10} /></span>;

    // const levelStyle = ['ml-1', 'ml-2', 'ml-3', 'ml-4', 'ml-5', 'ml-6', 'ml-7', 'ml-8', 'ml-9', 'ml-10'][node.level];
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

const One: Cardinality<TreeNode<Node>> = ({ node, children }) => {
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

const Leaf: TreeNodeElement<TreeNode<Node>> = ({ node }) => {
    return <FileNode node={node}></FileNode>;
};

function FileTree({ byId, nodeId }: TreeProps<TreeNode<Node>>) {
    return (
        <TreeElement
            byId={byId}
            nodeId={nodeId}
            Self={FileTree}
            Many={Ul}
            One={One}
            Node={FileNode}
            Root={Pass}
            Leaf={Leaf}
        />
    );
}
