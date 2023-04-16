import { TypeDuplicate } from '../../../../src/types';
import './Badge.scss';

export type BadgeProps = {
  group: TypeDuplicate['group'];
}

export function Badge({ group }: BadgeProps) {
  const color = {
    identical: 'yellow',
    renamed: 'blue',
    different: 'black',
  }[group];
  return (
    <span className={`badge badge--${color}`}>{group}</span>
  );
}