import { TypeDuplicate } from '../../../../src/types';
import './Badge.scss';

export type BadgeProps = {
  group: TypeDuplicate['group'];
  names: TypeDuplicate['names'];
}

export function Badge({ group, names }: BadgeProps) {
  const color = {
    identical: 'yellow',
    renamed: 'blue',
    different: 'black',
  }[group];
  return (
    <span className={`badge badge--${color}`}>
      <span className="mono count">
        ({Object.values(names || []).reduce((a, b) => a + b.count, 0)}x)
      </span>
      {group}
    </span>
  );
}