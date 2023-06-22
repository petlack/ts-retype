import { Box } from '@theme-ui/components';
import { Hamburger } from '~/components/Hamburger';
import { Button } from '~/components/Button';
import { Style, StyledComponent, StyledContainer } from '~/components/types';
import { useBoolean } from '~/hooks/useBoolean';
import { FC, ReactNode } from 'react';
import { Mix, Sx } from '~/termix/tx';
import './Sidebar.scss';

export type SidebarOwnProps = {
  isOpen: boolean;
  onClick: () => void;
}
export const SidebarButton: FC<Mix<'button', SidebarOwnProps>> = ({ isOpen, onClick, sx = {} }) => {
  const mergedSx: Sx = {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 20,
    ...(sx || {}),
  };
  return (
    <Button
      tx={{ colorScheme: 'primary', fill: 'solid', sizing: 'lg' }}
      sx={mergedSx}
      onClick={onClick}
      p={2}
    >
      <Hamburger flavor='shoot' weight='black' isOpen={isOpen} />
    </Button>
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

export const SidebarLayout: FC<StyledComponent & { children: [ReactNode, ReactNode] }> = ({ children, sx }) => {
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
        {children[0]}
      </Sidebar>
      {children[1]}
    </Box >
  );
};

