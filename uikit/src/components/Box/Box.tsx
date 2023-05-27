import { FC, forwardRef } from 'react';
import { Box as UiBox, BoxProps } from 'theme-ui';
import { TermixProps, TermixPropsNames, useTermix, useTermixStyle } from '~/termix';
import { omit } from 'ramda';
import { StyledContainer } from '~/components/types';

export const Box: FC<StyledContainer<TermixProps & BoxProps>> = forwardRef(({
  children,
  sx,
  ...boxProps
}, ref) => {
  const { theme } = useTermix();
  const styles = useTermixStyle(theme, boxProps);
  const mergedSx = {
    ...styles,
    ...sx,
  };
  return (
    <UiBox ref={ref} sx={mergedSx} {...omit(TermixPropsNames, boxProps)}>
      {children}
    </UiBox>
  );
});

