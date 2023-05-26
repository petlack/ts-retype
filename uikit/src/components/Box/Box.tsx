
import { FC } from 'react';
import { Box as UiBox } from 'theme-ui';
import { TermixProps, useTermix, useTermixStyle } from '~/termix';
import { StyledContainer } from '~/components/types';

export const Box: FC<StyledContainer<TermixProps>> = ({
  children,
  sx,
  ...tagProps
}) => {
  const { theme } = useTermix();
  const styles = useTermixStyle(theme, {
    ...tagProps,
  });
  const mergedSx = {
    ...styles,
    ...sx,
  };
  return (
    <UiBox sx={mergedSx}>
      {children}
    </UiBox>
  );
};

