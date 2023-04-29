import './Button.styl';

export type ButtonProps = {
  caption: string;
  className?: string;
  href?: string;
  icon?: JSX.Element;
  kind: 'link' | 'button';
  newWindow?: boolean;
  onClick?: () => void;
  size: 'md' | 'xl';
  style: 'default' | 'primary' | 'secondary';
}

export function Button({ caption, className, href, icon, kind, newWindow, onClick, size, style }: ButtonProps) {
  const childrenMarkup = (
    <>
      {icon}
      <span>{caption}</span>
    </>
  );
  const classNames = `btn btn__${style} btn__${size} ${className}`;
  if (kind === 'link') {
    const newWindowProps = newWindow ? { target: '_blank' } : {};
    return (
      <a className={classNames} href={href} {...newWindowProps}>
        {childrenMarkup}
      </a>
    );
  }
  return (
    <button className={classNames} onClick={onClick}>
      {childrenMarkup}
    </button>
  );
}