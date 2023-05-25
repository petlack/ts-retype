import { FC, forwardRef, PropsWithChildren, ReactNode } from 'react';
import { Button as UiButton, ButtonProps as UiButtonProps } from 'theme-ui';
import { TermixProps, useTermix, useTermixStyle } from 'termix';

export type ButtonProps = UiButtonProps & {
  leftIcon?: ReactNode,
  rightIcon?: ReactNode,
}

export const Button: FC<PropsWithChildren<TermixProps & ButtonProps>> = forwardRef(({
  children,
  leftIcon,
  rightIcon,
  disabled,
  ...buttonProps
}, ref) => {
  const theme = useTermix();
  const styles = useTermixStyle(theme, {
    element: theme.buttons || ({} as TermixProps['element']),
    ...{ ...buttonProps, variant: disabled ? 'disabled' : '' },
  });
  const markup = (
    <>
      {leftIcon}
      {children}
    </>
  );
  return (
    <UiButton
      ref={ref}
      disabled={disabled}
      sx={{ display: 'inline-flex', alignItems: 'center', ...styles }}
      {...buttonProps}
    >
      {markup}
    </UiButton>
  );
});
