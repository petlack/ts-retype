import type { TypeDuplicate } from '@ts-retype/search/types';

export type BadgeProps = {
  group: TypeDuplicate['group'];
  names: TypeDuplicate['names'];
}

const style: Record<TypeDuplicate['group'], { bg: string, fg: string }> = {
    identical: {
        bg: 'bg-yellow-100',
        fg: 'text-yellow-500',
    },
    renamed: {
        bg: 'bg-green-100',
        fg: 'text-green-500',
    },
    different: {
        bg: 'bg-black-100',
        fg: 'text-black-500',
    }
};

export function Badge({ group, names }: BadgeProps) {
    console.log(group);
    return (
        <span
            className={`text-sm font-bold ${style[group].bg} ${style[group].fg} px-2 py-1 rounded-md uppercase`}
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
