import { FC } from 'react';
import { Box, BoxProps } from '~/components/Box';
import { StyledContainer } from '~/components/types';

export type GridProps = StyledContainer<BoxProps>;

const gridSx: BoxProps['sx'] = {
  display: 'grid',
};

export const Grid: FC<GridProps> = ({ children, sx, ...props }) => {
  return <Box {...props} sx={{ ...gridSx, ...sx }}>{children}</Box>;
};

