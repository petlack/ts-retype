import { FC, forwardRef, ReactNode } from 'react';
import { Button as UiButton, ButtonProps as UiButtonProps } from 'theme-ui';
import { TermixProps, useTermix, useTermixStyle } from 'termix';
import { Spinner } from 'components/Spinner';
import { StyledComponent } from 'components/types';

export type ButtonProps = UiButtonProps & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

export const Button: FC<StyledComponent<TermixProps & ButtonProps>> = forwardRef(({
  children,
  leftIcon,
  rightIcon,
  disabled,
  isLoading,
  sx,
  ...buttonProps
}, ref) => {
  const disabledOrLoading = disabled || isLoading;
  const theme = useTermix();
  const styles = useTermixStyle(theme, {
    element: theme.buttons || ({} as TermixProps['element']),
    ...{ ...buttonProps, variant: disabledOrLoading ? 'disabled' : '' },
  });
  const markup = (
    <>
      {isLoading ? <Spinner flavor='ring' size='1em' /> : leftIcon}
      {children}
      {rightIcon}
    </>
  );
  return (
    <UiButton
      ref={ref}
      disabled={disabledOrLoading}
      sx={{ display: 'inline-flex', alignItems: 'center', ...sx, ...styles }}
      {...buttonProps}
    >
      {markup}
    </UiButton>
  );
});
