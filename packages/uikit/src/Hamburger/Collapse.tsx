import { FC } from 'react';
import { BurgerProps } from './Hamburger.js';

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
