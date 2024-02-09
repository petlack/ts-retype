import { FC } from 'react';
import { BurgerProps } from './Hamburger.js';
import './Sigma.css';

export const Sigma: FC<BurgerProps> = ({ className, size }) => {
    const svgClassName = [
        'ham',
        'hamRotate',
        'ham4',
        className,
    ].join(' ');
    return (
        <div className={className}>
            <svg className={svgClassName} viewBox="17 17 65 65" width={size}>
                <path
                    className="line top"
                    d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20" />
                <path
                    className="line middle"
                    d="m 70,50 h -40" />
                <path
                    className="line bottom"
                    d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20" />
            </svg>
        </div>
    );
};
