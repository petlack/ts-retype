import { FC } from 'react';
import { BurgerProps } from './Hamburger';
import './Shoot.scss';

export const Shoot: FC<BurgerProps> = ({ className }) => {
  return (
    <div className={className}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
