import { FunctionTypeCluster } from '../../types';

import { FileListing } from './FileListing';
import { KeyValueFeatures } from './KeyValueFeatures';
import { NamesListing } from './NamesListing';
import { TypeIcon } from './TypeIcon';

import './BaseCluster.scss';
import './FunctionalCluster.scss';

type FnFoo = (aaa: string, bbb: number) => Promise<void>
type FnBar = (aaa: string, bbb: number) => Promise<void>

enum EnFoo { Ok, Fail }
enum EnBar { Ok, Fail }

type UnFoo = 'a' | 'b'
type UnBar = 'a' | 'b'

export function FunctionCluster({ type, query, files, parameters, returnType, names }: FunctionTypeCluster & { query: string }) {
  return (
    <div className="cluster">
      <div className="title">
        <TypeIcon type={type} />
        <NamesListing names={names} query={query} />
        <span className="return-type mono">{returnType}</span>
      </div>
      <KeyValueFeatures keyValues={parameters} query={query} name="Parameters" />
      <FileListing files={files} query={query} type={type} />
    </div>
  );
}