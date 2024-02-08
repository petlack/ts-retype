import { FC } from 'react';

export type Option = {
    short: string,
    long: string,
    desc: string,
    args?: string,
};

export type OptionsProps = {
    children: Option[];
}

export const Options: FC<OptionsProps> = ({ children: options }) => {
    const optionsFlat = options.flatMap(({ short, long, args, desc }) => (
        [
            {
                key: short,
                className: 'font-mono font-bold',
                title: `-${short}, --${long} ${args || ''}`,
            },
            {
                key: long,
                className: 'leading-normal',
                title: desc,
            },
        ]
    ));

    return (
        <ul className="grid gap-y-4 gap-x-4 grid-cols-options">
            {optionsFlat.map(({ key, title, className }) => (
                <li key={key} className={className}>
                    {title}
                </li>
            ))}
        </ul>
    );
};
