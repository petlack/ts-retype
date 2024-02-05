import { FC } from 'react';

export type OverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  isTransitioning?: boolean;
  backdropMode?: 'lighten' | 'darken';
  speed?: number;
}

export const Overlay: FC<OverlayProps> = ({
    isOpen,
    onClose,
    backdropMode,
    isTransitioning,
    speed,
}) => {
    return (
        <div
            onClick={onClose}
            style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                background: backdropMode && { darken: 'rgba(0, 0, 0, 0.5)', lighten: 'rgba(255, 255, 255, 0.5)' }[backdropMode],
                // backdropFilter: 'blur(4px)',
                visibility: isTransitioning && isOpen ? 'visible' : 'hidden',
                opacity: isTransitioning && isOpen ? 1 : 0,
                transitionProperty: 'opacity',
                transition: `${speed}ms ease`,
                pointerEvents: isTransitioning && isOpen ? 'auto' : 'none',
                zIndex: isOpen ? 25 : 0,
            }}
        />
    );
};
