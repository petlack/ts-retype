import { Box } from '~/components/Box';
import { TermixContainer, TermixProps, useTermix, useTermixStyle } from '~/termix';

export const Tag: TermixContainer = ({
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
