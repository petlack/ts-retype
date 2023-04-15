import { DuplicateName } from './NamesListing';
import { TypeIcon } from './TypeIcon';
import { ArrayElement, TypeDuplicate } from '../../../../src/types';

import './Title.scss';

export type TitleProps = {
  type: ArrayElement<TypeDuplicate['files']>['type'];
  names: TypeDuplicate['names'];
}

export function Title({ type, names }: TitleProps) {
  return (
    <div className="title">
      <TypeIcon type={type} />
      <DuplicateName names={names} />
    </div>
  );
}