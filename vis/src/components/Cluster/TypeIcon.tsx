import { useState } from 'react';
import { CandidateType } from '../../../../src/types';

import './TypeIcon.scss';

export type TypeIconProps = {
  type: CandidateType['type'];
}

export function TypeIcon({ type }: TypeIconProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const tooltipContent = {
    function: 'Function Type Declaration',
    union: 'Union Type Declaration',
    enum: 'Enum Type Declaration',
    literal: 'Literal Type Declaration',
    alias: 'Type Alias Declaration',
    interface: 'Interface Declaration',
  }[type];
  return (
    <div className="candidate-type">
      <span
        className="mono"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >{`{${type[0].toUpperCase()}}`}</span>
      <span className={`tooltip ${isTooltipVisible ? 'visible' : ''}`}>{tooltipContent}</span>
    </div>
  );
}