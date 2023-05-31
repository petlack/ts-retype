import { forwardRef } from 'react';
import { Box, BoxOwnProps } from '../Box';
import { Assign, ForwardRef, StyledComponent } from '../types';

export type ListItemRadioProps = Assign<React.ComponentPropsWithRef<'input'>, StyledComponent<BoxOwnProps>>

export const ListItemRadio: ForwardRef<HTMLInputElement, ListItemRadioProps> = forwardRef((props, ref) => {
  const { children, colorScheme, fill, size, ...rest } = props;
  return (
    <>
      <Box
        ref={ref}
        as='input'
        type='radio'
        {...rest}
        sx={{
          position: 'absolute',
          opacity: 0,
          zIndex: -1,
          width: 1,
          height: 1,
          overflow: 'hidden'
        }}
      />

      <Box
        colorScheme={colorScheme}
        corners='sharp'
        mimic='static'
        fill={fill}
        density='gapped'
        sx={{
          position: 'absolute',
          inset: 0,
          cursor: 'pointer',
          color: 'base',
          '&:before': {
            content: '""',
            position: 'absolute',
            inset: '0px',
            borderRadius: 'sm',
            zIndex: 0,
          },
          'label:hover > &:before': {
            bg: 'primary-100',
            color: 'text',
          },
          '& ~ *': {
            cursor: 'pointer',
            position: 'relative',
            zIndex: 2,
          },
          'input:checked + &:before': {
            bg: 'primary-100',
            color: 'base',
          },
        }}>
        {children}
      </Box>
    </>
  );
});
