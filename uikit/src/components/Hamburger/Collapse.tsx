import { FC } from 'react';
import { BurgerProps } from './Hamburger';
import './Collapse.scss';

export const Collapse: FC<BurgerProps> = ({ className }) => {
  return (
    <div className={className}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
