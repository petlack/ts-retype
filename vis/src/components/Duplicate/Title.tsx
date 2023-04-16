import { DuplicateName } from './NamesListing';
import { TypeIcon } from './TypeIcon';
import { ArrayElement, TypeDuplicate } from '../../../../src/types';

import './Title.scss';

export type TitleProps = {
  type: ArrayElement<TypeDuplicate['files']>['type'];
  names: TypeDuplicate['names'];
  group: TypeDuplicate['group'];
}

export function Title({ group, type, names }: TitleProps) {
  return (
    <div className="title">
      <TypeIcon group={group} type={type} />
      <DuplicateName names={names} />
      <span className="badge">{group}</span>
    </div>
  );
}