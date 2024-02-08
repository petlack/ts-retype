export type OptionsProps = {
  options: { short: string, long: string, desc: string, args?: string }[];
}

export function Options({ options }: OptionsProps) {
    const optionsFlat = options.reduce((res, { short, long, args, desc }) => (
        [
            ...res,
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
    ), [] as { key: string, className: string, title: string }[]);
    const optionsMarkup = optionsFlat.map(({ key, title, className }) => (
        <li key={key} className={className}>
            {title}
        </li>
    ));
    return (
        <ul className="grid gap-y-4 gap-x-4 grid-cols-options">
            {optionsMarkup}
        </ul>
    );
}
