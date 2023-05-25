import { Box, Button } from '@theme-ui/components';
import { Hamburger } from 'components/Hamburger';
import { IconButton } from 'components/IconButton';
import { Style, StyledComponent, StyledContainer } from 'components/types';
import { useBoolean } from 'hooks/useBoolean';
import { FC } from 'react';
import './Sidebar.scss';

const ICON_MENU = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
    <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
  </svg>
);

const ICON_CLOSE = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
    <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
  </svg>
);

export const SidebarButton: FC<StyledComponent<{ isOpen: boolean, onClick: () => void }>> = ({ isOpen, onClick, sx = {} }) => {
  const baseSx: Style = {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 20,
    p: 2,
    cursor: 'pointer',
  };

  const mergedSx: Style = {
    ...baseSx,
    ...sx,
  };

  return (
    <IconButton variant='plain.small' onClick={onClick} sx={mergedSx}>
      <Hamburger flavor='shoot' size={16} weight='black' isOpen={isOpen} />
    </IconButton>
  );
};

const Sidebar: FC<StyledContainer<{ isOpen: boolean }>> = ({ children, isOpen, sx }) => {
  const baseSx: Style = {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    zIndex: 10,
    transition: 'transform 200ms ease-in-out, opacity 150ms ease-in',
    display: 'flex',
  };

  const openSx: Style = {
    transform: 'translateX(0)',
    opacity: 1,
  };

  const closedSx: Style = {
    transform: 'translateX(20%)',
    userSelect: 'none',
    touchAction: 'none',
    pointerEvents: 'none',
    opacity: 0,
  };

  const mergedSx: Style = {
    ...baseSx,
    ...(isOpen ? openSx : closedSx),
    ...sx,
  };

  return (
    <Box sx={mergedSx}>
      {children}
    </Box>
  );
};

export const SidebarLayout: FC<StyledContainer> = ({ children, sx }) => {
  const [isOpen, toggle] = useBoolean(false);
  const baseSx: Style = {
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  };
  const mergedSx: Style = {
    ...baseSx,
    ...sx,
  };

  return (
    <Box sx={mergedSx}>
      <SidebarButton
        onClick={toggle}
        isOpen={isOpen}
      />
      <Sidebar
        isOpen={isOpen}
        sx={{
        }}
      >
        {children}
      </Sidebar>
    </Box >
  );
};

