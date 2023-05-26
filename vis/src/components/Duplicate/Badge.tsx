import type { TypeDuplicate } from '@ts-retype/retype';
import { Tag } from '@ts-retype/uikit';

export type BadgeProps = {
  group: TypeDuplicate['group'];
  names: TypeDuplicate['names'];
}

export function Badge({ group, names }: BadgeProps) {
  const color = {
    identical: 'yellow',
    renamed: 'green',
    different: 'black',
  }[group];
  return (
    <Tag colorScheme={color} fill='semi' weight='bold' size='sm' sx={{ textTransform: 'uppercase' }}>
      ({Object.values(names || []).reduce((a, b) => a + b.count, 0)}x)
      {group}
    </Tag>
  );
}
