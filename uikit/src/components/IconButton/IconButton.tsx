import { Style, StyledContainer } from 'components/types';
import { FC, forwardRef } from 'react';
import { Button, ButtonProps } from 'theme-ui';

export const IconButton: FC<StyledContainer<ButtonProps>> = forwardRef(({ children, onClick, sx, variant }, ref) => {
  const size = 32;
  const baseSx: Style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    width: size,
    height: size,
  };
  const mergedSx = {
    ...baseSx,
    ...sx,
  };
  return (
    <Button ref={ref} sx={mergedSx} onClick={onClick} variant={variant}>
      {children}
    </Button>
  );
});
