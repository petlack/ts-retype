import './Button.styl';

export type ButtonProps = {
  icon: JSX.Element;
  caption: string;
  kind: 'primary' | 'secondary';
  href: string;
  newWindow?: boolean;
}

export function Button({ icon, caption, kind, href, newWindow }: ButtonProps) {
  const newWindowProps = newWindow ? { target: '_blank' } : {};
  return (
    <a className={`btn btn__${kind} btn__xl`} href={href} {...newWindowProps}>
      {icon}
      <span>{caption}</span>
    </a>
  );
}