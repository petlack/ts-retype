import { DuplicateName } from './NamesListing';
import { TypeIcon } from './TypeIcon';
import { TypeDuplicate, CandidateType } from '../../../../src/types';

import './ClusterTitle.scss';

export type ClusterTitleProps = {
  type: CandidateType['type'];
  names: TypeDuplicate['names'];
  query: string;
}

export function ClusterTitle({ type, names, query  }: ClusterTitleProps) {
  return (
    <div className="title">
      <TypeIcon type={type} />
      <DuplicateName names={names} query={query} />
    </div>
  );
}