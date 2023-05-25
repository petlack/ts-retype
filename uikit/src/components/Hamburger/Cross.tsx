import { FC } from 'react';
import { BurgerProps } from './Hamburger';
import './Cross.scss';

export const Cross: FC<BurgerProps> = ({ className }) => {
  return (
    <div className={className}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
