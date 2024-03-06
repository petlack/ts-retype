import { clsx } from '../clsx.js';

export type LogoProps = {
    initials: string;
    name: string;
}

export function Logo({ initials, name }: LogoProps) {
    return (
        <div className={clsx(
            'flex flex-row items-end',
            'cursor-pointer',
        )}>
            <div className={clsx(
                'flex items-end justify-end',
                'p-1 leading-none',
                'bg-accent-500 text-white',
                'rounded-sm',
                'h-full',
                'aspect-square',
            )}>
                <span className="font-black">
                    {initials}
                </span>
            </div>
            <div className={clsx(
                'text-accent-500',
                'rounded-md',
                'p-1 leading-none',
            )}>
                <span className="font-bold">
                    {name}
                </span>
            </div>
        </div>
    );
}
