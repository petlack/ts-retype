import { Style, StyledContainer } from 'components/types';
import { FC, forwardRef } from 'react';
import { Button, ButtonProps } from 'theme-ui';

export const IconButton: FC<StyledContainer<ButtonProps>> = forwardRef(({ children, onClick, sx, variant }, ref) => {
  const baseSx: Style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  };
  const mergedSx = {
    ...baseSx,
    ...sx,
  };
  return (
    <Button ref={ref} sx={mergedSx} onClick={onClick}>
      {children}
    </Button>
  );
});
