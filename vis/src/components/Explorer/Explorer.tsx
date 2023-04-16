import { indexWith } from '../Tree/utils';
import { useCallback, useMemo } from 'react';
import { useTree } from '../Tree/useTree';
import { ArrayElement, TypeDuplicate } from '../../../../src/types';
import {
  ICON_CHEVRON_DOWN,
  ICON_CODE,
  ICON_FILE,
  ICON_FOLDER,
  IconLetter,
} from './icons';
import { Pass, Li, Ul } from '../Tree/Elements';
import { Tree, TreeNode, TreeProps } from '../Tree';
import { TreeProvider, TreeProviderProps } from '../Tree/TreeProvider';
import './Explorer.scss';

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
  const onClickHandler = useCallback(() => onClick(node.id), [node.id]);
  const iconMarkup = type && node.data.type === 'type' ? 
    <IconLetter letter={type[0].toUpperCase()} /> :
    { file: ICON_FILE, dir: ICON_FOLDER, type: ICON_CODE }[node.data.type];
  const chevronMarkup = node.data.type === 'type' ?
    <span className="icon-empty"></span> :
    <span>{ICON_CHEVRON_DOWN}</span>;
  return (
    <>
      <span onClick={onClickHandler}>
        {chevronMarkup}
        <span>{iconMarkup}</span>
        <span>{node.data.name}</span>
      </span>
      {children}
    </>
  );
};

export function FileTree(props: TreeProps<Node>) {
  return (
    <Tree
      {...props}
      Self={FileTree}
      Many={Ul}
      One={Li}
      Node={FileNode}
      Root={Pass}
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
};

export function Explorer({ files, onClick }: ExplorerProps) {
  const index = useMemo(() => createIndex(files), [files]);
  return (
    <div className="explorer">
      <TreeProvider index={index} onClick={onClick}>
        <FileTree node={index.byId[0]} byId={index.byId} />
      </TreeProvider>
    </div>
  );
}
