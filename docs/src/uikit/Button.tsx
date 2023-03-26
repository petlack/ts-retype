import './Button.styl';

export type ButtonProps = {
  icon: JSX.Element;
  caption: string;
  kind: 'primary' | 'secondary';
}

export function Button({ icon, caption, kind }: ButtonProps) {
  return (
    <button className={`btn btn-${kind}`}>
      {icon}
      <span>{caption}</span>
    </button>
  );
}