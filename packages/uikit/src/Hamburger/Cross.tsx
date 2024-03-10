import { FC } from 'react';
import { BurgerProps } from './Hamburger.js';
import './Cross.css';

export const Cross: FC<BurgerProps> = ({ className }) => {
    return (
        <div className={className}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
};
