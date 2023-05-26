import { StyledComponent } from 'components/types';
import { useBoolean } from 'hooks/useBoolean';
import { CSSProperties, FC } from 'react';
import { Collapse } from './Collapse';
import { Cross } from './Cross';
import { Expand } from './Expand';
import { Shoot } from './Shoot';
import { Sigma } from './Sigma';
import './Hamburger.scss';

export type BurgerProps = StyledComponent<{
  className: string;
  toggle?: () => void;
  size?: number;
}>;

export type HamburgerProps = {
  flavor: 'collapse' | 'cross' | 'expand' | 'shoot' | 'sigma';
  weight?: 'thin' | 'light' | 'medium' | 'bold' | 'black';
  size?: number;
}

export type HamburgerControlsProps = {
  isOpen: boolean;
  toggle?: () => void;
}

const ControlledHamburger: FC<StyledComponent<HamburgerProps & HamburgerControlsProps>> = ({ flavor, size = 16, weight = 'black', isOpen, toggle }) => {
  const className = [
    flavor === 'expand' || flavor === 'sigma' ? '' : 'burger',
    flavor,
    isOpen ? 'open' : '',
  ].join(' ');
  const Burger = {
    collapse: Collapse,
    cross: Cross,
    expand: Expand,
    shoot: Shoot,
    sigma: Sigma,
  }[flavor];
  const style: CSSProperties = {
    '--size-burger': '1em',
    '--size-ham': {
      thin: `${size / 16}px`,
      light: `${size / 12}px`,
      medium: `${size / 8}px`,
      bold: `${size / 6}px`,
      black: `${size / 4}px`,
    }[weight]
  } as CSSProperties;
  const hamburgerProps = toggle ? { onClick: toggle } : {};
  return (
    <div style={style} className="hamburger" {...hamburgerProps}>
      <Burger className={className} size={size} />
    </div>
  );
};

const UncontrolledHamburger: FC<StyledComponent<HamburgerProps>> = (props) => {
  const [isOpen, toggle] = useBoolean(false);
  return <ControlledHamburger {...props} isOpen={isOpen} toggle={toggle} />;
};

export const Hamburger: FC<StyledComponent<HamburgerProps & Partial<HamburgerControlsProps>>> = ({ isOpen, ...props }) => {
  if (isOpen != null) {
    return <ControlledHamburger isOpen={isOpen} {...props} />;
  }
  return <UncontrolledHamburger {...props} />;
};

