import './Options.styl';

export type OptionsProps = {
  options: { short: string, long: string, desc: string, args?: string }[];
}

export function Options({ options }: OptionsProps) {
  const optionsFlat = options.reduce((res, option) => (
    [
      ...res,
      {
        key: option.short,
        className: 'name',
        title: `-${option.short}, --${option.long} ${option.args}`,
      },
      {
        key: option.long,
        className: 'desc',
        title: option.desc,
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