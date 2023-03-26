import './Button.styl';

export type ButtonProps = {
  icon: JSX.Element;
  caption: string;
  kind: 'primary' | 'secondary';
  href: string;
}

export function Button({ icon, caption, kind, href }: ButtonProps) {
  return (
    <a className={`btn btn-${kind}`} href={href}>
      {icon}
      <span>{caption}</span>
    </a>
  );
}