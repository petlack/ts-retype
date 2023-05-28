import { FC, forwardRef } from 'react';
import { Box as UiBox, BoxProps } from 'theme-ui';
import { TermixProps, TermixPropsNames } from '~/termix/types';
import { StyledContainer } from '~/components/types';
import { omit } from 'ramda';
import { useTermix } from '~/termix/useTermix';
import { useTermixStyle } from '~/termix/termix';

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

