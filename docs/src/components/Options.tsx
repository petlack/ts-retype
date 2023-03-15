import './Options.styl';

export type OptionsProps = {
  options: { short: string, long: string, desc: string, args?: string }[];
}

export function Options({ options }: OptionsProps) {
  const optionsMarkup = options.map(option => (
    <>
      <li className="options-item options-item-name">-{option.short}, --{option.long} {option.args}</li>
      <li className="options-item options-item-desc">{option.desc}</li>
    </>
  ));
  return (
    <ul className="options">
      {optionsMarkup}
    </ul>
  );
}