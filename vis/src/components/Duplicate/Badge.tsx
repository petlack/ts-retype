import type { TypeDuplicate } from '@ts-retype/retype';
import { Tag } from '@ts-retype/uikit';
import type { StyledComponent } from '@ts-retype/uikit';

export type BadgeProps = {
  group: TypeDuplicate['group'];
  names: TypeDuplicate['names'];
}

export function Badge({ group, names, sx }: StyledComponent<BadgeProps>) {
  const color = {
    identical: 'yellow',
    renamed: 'green',
    different: 'black',
  }[group];
  return (
    <Tag
      tx={{
        colorScheme: color,
        fill: 'semi',
        mimic: 'tint',
        energy: 'live',
        weight: 'bold',
        sizing: 'sm',
      }} sx={{ textTransform: 'uppercase', ...sx }}>
      ({Object.values(names || []).reduce((a, b) => a + b.count, 0)}x)
      {group}
    </Tag>
  );
}
