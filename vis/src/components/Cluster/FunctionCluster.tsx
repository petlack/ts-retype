import { ClusterTitle } from './ClusterTitle';
import { FunctionTypeCluster } from '../../types';
import { FileListing } from './FileListing';
import { KeyValueFeatures } from './KeyValueFeatures';
import { NamesListing } from './NamesListing';

import './BaseCluster.scss';
import './FunctionalCluster.scss';

type FnFoo = (aaa: string, bbb: number) => Promise<void>
type FnBar = (aaa: string, bbb: number) => Promise<void>

enum EnFoo { Ok, Fail }
enum EnBar { Ok, Fail }

type UnFoo = 'a' | 'b'
type UnBar = 'a' | 'b'

export function FunctionCluster({ type, files, parameters, returnType, names }: FunctionTypeCluster) {
  return (
    <div className="cluster cluster-functional">
      <ClusterTitle names={names} type={type} />
      <NamesListing names={names} />
      <div className="return-type">
        <h3>Return type</h3>
        <span className="mono">{returnType}</span>
      </div>
      <KeyValueFeatures keyValues={parameters} name="Parameters" />
      <FileListing files={files} type={type} />
    </div>
  );
}