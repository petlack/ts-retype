import type { TypeDuplicate } from '@ts-retype/search/types';
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
        <span
            className={`text-sm font-bold text-${color}-500 bg-${color}-100 px-2 py-1 rounded-md`}
            // tx={{
            //     colorScheme: color,
            //     fill: 'semi',
            //     mimic: 'tint',
            //     energy: 'live',
            //     weight: 'bold',
            //     sizing: 'sm',
            // }} sx={{ textTransform: 'uppercase' }}
        >
        ({Object.values(names || []).reduce((a, b) => a + b.count, 0)}x) {group}
        </span>
    );
}
