import { FC } from 'react';
import { BurgerProps } from './Hamburger.js';
import './Expand.css';

export const Expand: FC<BurgerProps> = ({ className }) => {
    return (
        <div className={className}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
};
