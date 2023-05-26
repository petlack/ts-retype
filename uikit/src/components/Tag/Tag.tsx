import { FC, PropsWithChildren } from 'react';
import { Box } from 'theme-ui';
import { TermixProps, useTermix, useTermixStyle } from 'termix';

export const Tag: FC<PropsWithChildren<TermixProps>> = ({
  children,
  ...tagProps
}) => {
  const { theme } = useTermix();
  const styles = useTermixStyle(theme, {
    element: theme.tags || {} as TermixProps['element'],
    ...tagProps,
  });
  return (
    <Box
      sx={{ display: 'inline-flex', ...styles }}
    >
      {children}
    </Box>
  );
};
