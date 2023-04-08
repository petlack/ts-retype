import { ClusterTitle } from './ClusterTitle';
import { FunctionTypeCluster } from '../../types';
import { FileListing } from './FileListing';
import { DefinitionSnippet } from './DefinitionSnippet';
import { NamesListing } from './NamesListing';

import './BaseCluster.scss';
import './FunctionalCluster.scss';

type FnFoo = (aaa: string, bbb: number) => Promise<void>
type FnBar = (aaa: string, bbb: number) => Promise<void>

enum EnFoo { Ok, Fail }
enum EnBar { Ok, Fail }

type UnFoo = 'a' | 'b'
type UnBar = 'a' | 'b'

export function FunctionCluster({ type, files, group, names }: FunctionTypeCluster) {
  return (
    <div className="cluster cluster-functional">
      <ClusterTitle names={names} type={type} />
      <NamesListing names={names} />
      <DefinitionSnippet files={files} />
      <FileListing files={files} type={type} similarity={group} />
    </div>
  );
}