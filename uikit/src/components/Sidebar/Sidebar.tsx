import { Box } from '@theme-ui/components';
import { Hamburger } from 'components/Hamburger';
import { IconButton } from 'components/IconButton';
import { Style, StyledComponent, StyledContainer } from 'components/types';
import { useBoolean } from 'hooks/useBoolean';
import { FC } from 'react';
import './Sidebar.scss';

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
    transition: 'transform 150ms ease-in-out, opacity 150ms ease-in',
    transformOrigin: 'top right',
    display: 'flex',
  };

  const openSx: Style = {
    transform: 'translateX(0)',
    opacity: 1,
  };

  const closedSx: Style = {
    transform: 'translateX(100%)',
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
      >
        {children}
      </Sidebar>
    </Box >
  );
};

