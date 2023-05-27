import { FC } from 'react';
import { Box } from 'theme-ui';
import { TermixProps, useTermix, useTermixStyle } from '~/termix';
import { StyledContainer } from '~/components/types';

export const Tag: FC<StyledContainer<TermixProps>> = ({
  children,
  sx,
  density = 'snug',
  ...tagProps
}) => {
  const { theme } = useTermix();
  const styles = useTermixStyle(theme, {
    element: theme.tags || {} as TermixProps['element'],
    density,
    ...tagProps,
  });
  const mergedSx = {
    display: 'inline-flex',
    ...styles,
    ...sx,
  };
  return (
    <Box sx={mergedSx}>
      {children}
    </Box>
  );
};
