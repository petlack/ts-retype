import { FC, forwardRef, PropsWithChildren } from 'react';
import { Button as UiButton, ButtonProps } from 'theme-ui';
import { TermixProps, useTermix, useTermixStyle } from 'termix';

export const Button: FC<PropsWithChildren<TermixProps & ButtonProps>> = forwardRef(({
  children,
  // color,
  // variant = 'default',
  // fill = 'solid',
  // size = 'md',
  // density = 'airy',
  // weight = 'bold',
  // corners = 'round',
  // energy = 'live',
  // mimic = 'tint',
  ...buttonProps
}, ref) => {
  const theme = useTermix();
  const styles = useTermixStyle(theme, {
    element: theme.buttons || ({} as TermixProps['element']),
    ...buttonProps,
    // color,
    // variant,
    // fill,
    // size,
    // density,
    // weight,
    // corners,
    // energy,
    // mimic,
  });
  return (
    <UiButton
      ref={ref}
      sx={{ display: 'inline-flex', ...styles }}
      {...buttonProps}
    >
      {children}
    </UiButton>
  );
});
