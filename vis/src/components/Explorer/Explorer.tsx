import { indexWith } from '../Tree/utils';
import { useTree } from '../Tree/useTree';
import { ArrayElement, TypeDuplicate } from '../../../../src/types';
import { ICON_CHEVRON_DOWN, ICON_CODE, ICON_FILE, ICON_FOLDER } from './icons';
import { Pass, Li, Ul } from '../Tree/Elements';
import { Tree, TreeNode, TreeProps } from '../Tree';
import { TreeProvider, TreeProviderProps } from '../Tree/TreeProvider';
import './Explorer.scss';
import { useMemo } from 'react';

type File = ArrayElement<TypeDuplicate['files']>;

export const FileNode: TreeNode<File> = ({ prefix, data, id }) => {
  const { onClick } = useTree();
  return (
    <>
      <span>
        <div className="icon-empty"></div>
        <span>{ICON_FILE}</span>
        <span>{prefix}</span>
      </span>
      <Ul>
        <Li className="duplicate" onClick={() => onClick(id)}>
          <span>
            <div className="icon-empty"></div>
            <span>{ICON_CODE}</span>
            <span>{data.name}</span>
            <span className="italic">({data.type})</span>
          </span>
        </Li>
      </Ul>
    </>
  );
};

export const DirNode: TreeNode<File> = ({ prefix }) => {
  return (
    <span>
      <span>{ICON_CHEVRON_DOWN}</span>
      <span>{ICON_FOLDER}</span>
      <span>{prefix}</span>
    </span>
  );
};

export function FileTree(props: TreeProps<File>) {
  return (
    <Tree
      {...props}
      Self={FileTree}
      Many={Ul}
      One={Li}
      Leaf={FileNode}
      Node={DirNode}
      Root={Pass}
    />
  );
}

const createIndex = indexWith(
  ({ file }: File) => file.split('/'),
  { file: '', name: 'anonymous', type: 'alias', lines: [0, 0], pos: [0, 0], src: '', srcHgl: {} },
);
  
export type ExplorerProps = {
  files: TypeDuplicate['files'];
  onClick?: TreeProviderProps<File>['onClick'];
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
