import { DuplicateName } from './NamesListing';
import { TypeIcon } from './TypeIcon';
import { ArrayElement, TypeDuplicate } from '../../../../src/types';

import './ClusterTitle.scss';

export type ClusterTitleProps = {
  type: ArrayElement<TypeDuplicate['files']>['type'];
  names: TypeDuplicate['names'];
}

export function ClusterTitle({ type, names }: ClusterTitleProps) {
  return (
    <div className="title">
      <TypeIcon type={type} />
      <DuplicateName names={names} />
    </div>
  );
}