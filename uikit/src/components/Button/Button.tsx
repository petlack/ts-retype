import { FC, forwardRef, ReactNode } from 'react';
import { Button as UiButton, ButtonProps as UiButtonProps } from 'theme-ui';
import { Mix, useTermix, termix } from '~/termix';
import { Spinner } from '~/components/Spinner';

export type ButtonOwnProps = UiButtonProps & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

export type ButtonProps = Mix<'button', ButtonOwnProps>;

export const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  leftIcon,
  rightIcon,
  disabled,
  isLoading,
  sx,
  tx,
  ...buttonProps
}, ref) => {
  const disabledOrLoading = disabled || isLoading;
  const { theme } = useTermix();
  const styles = termix(theme, { variant: disabledOrLoading ? 'disabled' : undefined, ...tx }, 'button');
  const mergedSx = {
    ...styles,
    ...sx,
  };
  const markup = (
    <>
      {isLoading ? <Spinner flavor='ring' sx={{ fontSize: mergedSx.fontSize }} /> : leftIcon}
      {children}
      {rightIcon}
    </>
  );
  return (
    <UiButton
      ref={ref}
      disabled={disabledOrLoading}
      sx={{ display: 'inline-flex', alignItems: 'center', ...mergedSx }}
      {...buttonProps}
    >
      {markup}
    </UiButton>
  );
});
