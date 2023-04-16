
import { ArrayElement, TypeDuplicate } from '../../../../src/types';
import { Tooltip } from '../../hooks/useTooltip';

import './TypeIcon.scss';

export type TypeIconProps = {
  type: ArrayElement<TypeDuplicate['files']>['type'];
  group: TypeDuplicate['group']
}

export function TypeIcon({ type }: TypeIconProps) {
  const tooltipContent = {
    function: 'Function Type Declaration',
    union: 'Union Type Declaration',
    enum: 'Enum Type Declaration',
    literal: 'Literal Type Declaration',
    alias: 'Type Alias Declaration',
    interface: 'Interface Declaration',
  }[type];

  const typeSymbol = {
    function: '=>',
    union: '[]',
    enum: '[]',
    literal: '{}',
    alias: '{}',
    interface: '{}',
  }[type];
  
  return (
    <div className="type-icon">
      <Tooltip>
        <span className="name mono">{typeSymbol}</span>
        <span>{tooltipContent}</span>
      </Tooltip>
    </div>
  );
}