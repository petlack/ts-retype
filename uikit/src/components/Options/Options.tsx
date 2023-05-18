import './Options.scss';

export type OptionsProps = {
  options: { short: string, long: string, desc: string, args?: string }[];
}

export function Options({ options }: OptionsProps) {
  const optionsFlat = options.reduce((res, { short, long, args, desc }) => (
    [
      ...res,
      {
        key: short,
        className: 'name',
        title: `-${short}, --${long} ${args || ''}`,
      },
      {
        key: long,
        className: 'desc',
        title: desc,
      },
    ]
  ), [] as { key: string, className: string, title: string }[]);
  const optionsMarkup = optionsFlat.map(({ key, title, className }) => (
    <li key={key} className={`options-item options-item-${className}`}>
      {title}
    </li>
  ));
  return (
    <ul className="options">
      {optionsMarkup}
    </ul>
  );
}
