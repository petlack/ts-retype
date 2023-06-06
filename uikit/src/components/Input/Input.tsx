import { forwardRef, ReactNode } from 'react';
import { Assign, ForwardRef, StyledComponent } from '../types';
import { Box, BoxOwnProps } from '../Box';
import { TermixProps, TermixPropsNames } from '~/termix/types';
import { omit } from 'ramda';
import { useTermix } from '~/termix/useTermix';
import { useTermixStyle } from '~/termix/termix';

type InputOwnProps = BoxOwnProps & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export type InputProps = Assign<React.ComponentPropsWithRef<'input'>, StyledComponent<InputOwnProps>>

export const Input: ForwardRef<HTMLInputElement, InputProps> = forwardRef((props, ref) => {
  const {
    fill = 'outline',
    density = 'gapped',
    corners = 'dull',
    mimic = 'static',
    energy = 'live',
    sx,
    leftIcon,
    rightIcon,
    ...rest
  } = props;
  const { theme } = useTermix();

  const boxProps: BoxOwnProps = {
    ...rest,
    fill,
    density,
    corners,
    mimic,
    energy,
    element: theme.inputs || {} as TermixProps['element'],
  };

  const color = boxProps.colorScheme || 'primary';
  const styles = useTermixStyle(theme, boxProps);
  const ownStyles: BoxOwnProps['sx'] = {
    'color': 'text',
    '&:focus': {
      borderColor: color,
      borderWidth: 1,
      boxShadow: `var(--clr-${color}) 0px 0px 5px -2px, var(--clr-${color}) 0px 0px 1px 0px`,
      outline: 'none',
    },
  };
  const mergedSx: BoxOwnProps['sx'] = {
    ...styles,
    ...ownStyles,
    ...sx,
  };

  const boxMarkup = (
    <Box
      as='input'
      ref={ref}
      sx={mergedSx}
      {...omit(TermixPropsNames, boxProps)}
    />
  );

  const markup = leftIcon || rightIcon ? (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
    }}>
      {leftIcon && <Box sx={{
        ...mergedSx,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRight: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bg: 'mantle',
      }}>
        {leftIcon}
      </Box>}

      <Box
        as='input'
        ref={ref}
        sx={{
          ...mergedSx,
          flex: 1,
          borderTopLeftRadius: leftIcon ? 0 : undefined,
          borderBottomLeftRadius: leftIcon ? 0 : undefined,
          borderTopRightRadius: rightIcon ? 0 : undefined,
          borderBottomRightRadius: rightIcon ? 0 : undefined,
        }}
        {...omit(TermixPropsNames, boxProps)}
      />

      {rightIcon && <Box sx={{
        ...mergedSx,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderLeft: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bg: 'mantle',
      }}>
        {rightIcon}
      </Box>}
    </Box>
  ) : boxMarkup;

  return markup;
});
