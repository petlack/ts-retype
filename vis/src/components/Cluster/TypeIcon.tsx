import { useState } from 'react';
import { CandidateTypeCluster } from '../../types';

export type TypeIconProps = {
  type: CandidateTypeCluster['type'];
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
    <div>
      <span
        className="candidate-type mono"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >{`{${type[0].toUpperCase()}}`}</span>
      <span className={`tooltip ${isTooltipVisible ? 'visible' : ''}`}>{tooltipContent}</span>
    </div>
  );
}