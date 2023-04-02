import { CandidateType } from '../../../../src/types';
import { Tooltip } from '../../hooks/useTooltip';

import './TypeIcon.scss';

export type TypeIconProps = {
  type: CandidateType['type'];
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
  
  return (
    <div className="type-icon">
      <Tooltip>
        <span className="name mono">{`{${type[0].toUpperCase()}}`}</span>
        <span>{tooltipContent}</span>
      </Tooltip>
    </div>
  );
}