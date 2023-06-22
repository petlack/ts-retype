import { forwardRef, cloneElement, isValidElement, ReactNode, ReactElement } from 'react';
import { ForwardRef } from '../types';
import { Box, BoxOwnProps } from '../Box';
import { useTermix } from '~/termix/useTermix';
import { termix } from '~/termix/termix';
import { Mix } from '~/termix/tx';

type InputOwnProps = {
  leftOuter?: ReactNode;
  rightOuter?: ReactNode;
  leftInner?: ReactNode;
  rightInner?: ReactNode;
}

export type InputProps = Mix<'input', InputOwnProps>;

export const Input: ForwardRef<HTMLInputElement, InputProps> = forwardRef((props, ref) => {
  const {
    sx,
    tx,
    leftOuter,
    rightOuter,
    leftInner,
    rightInner,
    ...boxProps
  } = props;
  const { theme } = useTermix();
  const styles = termix(theme, tx, 'input');
  const mergedSx = {
    ...styles,
    ...sx,
  };

  // return (
  //   <UiBox ref={ref} sx={mergedSx} {...boxProps} />
  // );

  // const boxProps: BoxOwnProps = {
  //   ...rest,
  //   fill,
  //   density,
  //   corners,
  //   mimic,
  //   energy,
  //   element: theme.inputs || {} as TermixProps['element'],
  // };

  // const color = boxProps.colorScheme || 'primary';
  // const styles = useTermixStyle(theme, boxProps);
  // const ownStyles: BoxOwnProps['sx'] = {
  //   'color': 'text',
  //   '&:focus': {
  //     borderColor: color,
  //     borderWidth: 1,
  //     boxShadow: `var(--clr-${color}) 0px 0px 5px -2px, var(--clr-${color}) 0px 0px 1px 0px`,
  //     outline: 'none',
  //   },
  // };
  // const mergedSx: BoxOwnProps['sx'] = {
  //   ...styles,
  //   ...ownStyles,
  //   ...sx,
  // };

  const boxMarkup = (
    <Box
      as='input'
      element='input'
      ref={ref}
      sx={mergedSx}
      {...boxProps}
    />
  );

  const leftInnerMarkup = isValidElement(leftInner) ?
    cloneElement(
      leftInner as ReactElement<BoxOwnProps>,
      { sx: { position: 'absolute', left: 0 } }
    ) :
    leftInner;
  const rightInnerMarkup = isValidElement(rightInner) ?
    cloneElement(
      rightInner as ReactElement<BoxOwnProps>,
      { sx: { position: 'absolute', right: 1, top: 1, bottom: 1 } }
    ) :
    rightInner;

  const inputMarkup = leftInner || rightInner ? (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        p: 0,
        gap: 1,
      }}
    >
      {leftInnerMarkup}
      <Box
        as='input'
        element='input'
        ref={ref}
        sx={{
          flex: 1,
          paddingRight: rightInner ? '4rem' : undefined,
        }}
        {...boxProps}
      />
      {rightInnerMarkup}
    </Box>
  ) : (
    <Box
      as='input'
      element='input'
      ref={ref}
      sx={{
        ...mergedSx,
        flex: 1,
        borderTopLeftRadius: leftOuter ? 0 : undefined,
        borderBottomLeftRadius: leftOuter ? 0 : undefined,
        borderTopRightRadius: rightOuter ? 0 : undefined,
        borderBottomRightRadius: rightOuter ? 0 : undefined,
      }}
      {...boxProps}
    />
  );

  const markup = leftOuter || rightOuter ? (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
    }}>
      {leftOuter && <Box sx={{
        ...mergedSx,
        p: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRight: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bg: (mergedSx as any)['--_clr-outer-bg'],
        color: (mergedSx as any)['--_clr-outer-fg'],
      }}>
        {leftOuter}
      </Box>}

      {inputMarkup}

      {rightOuter && <Box sx={{
        ...mergedSx,
        p: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderLeft: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bg: (mergedSx as any)['--_clr-outer-bg'],
        color: (mergedSx as any)['--_clr-outer-fg'],
      }}>
        {rightOuter}
      </Box>}
    </Box>
  ) : inputMarkup;

  return markup;
});
