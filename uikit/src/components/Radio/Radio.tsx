import { forwardRef } from 'react';
import { Assign, ForwardRef, StyledComponent } from '../types';
import { Box, BoxOwnProps } from '../Box';

type RadioOwnProps = BoxOwnProps & {
  selectedIndex?: number;
}

export type RadioProps = Assign<React.ComponentPropsWithRef<'input'>, StyledComponent<RadioOwnProps>>

export const Radio: ForwardRef<HTMLInputElement, RadioProps> = forwardRef((props, ref) => {
  const {
    className,
    fill = 'solid',
    density = 'gapped',
    corners = 'pill',
    mimic = 'tint',
    energy = 'live',
    size,
    sx,
    ...rest
  } = props;
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
        className={className}
        aria-hidden={true}
        {...({ density, corners })}
        sx={{
          position: 'relative',
          cursor: 'pointer',
          aspectRatio: 1,
          width: '1em',
          flexShrink: 0,
          bg: 'none',
          border: '2px solid',
          borderColor: 'overlay0',
          transform: 'scale(1)',
          transition: '150ms ease-in',
          transitionProperty: 'transform,background,border-color',
          '&:after': {
            content: '""',
            position: 'absolute',
            inset: 1,
            borderRadius: '100vw',
            bg: 'primary',
            transform: 'scale(0)',
            transition: '150ms ease-in',
            transitionProperty: 'transform',
          },
          '&:hover, label:hover &': {
            borderColor: 'overlay2',
            bg: 'mantle',
            transform: 'scale(1.05)',
          },
          'input:checked ~ &': {
            '&:after': {
              transform: 'scale(1)',
            },
          },
          'input:checked ~ &:hover': {
            '&:after': {
              transform: 'scale(1.1)',
            },
          },
          'input:focus ~ &': {
            border: '2px solid',
            borderColor: 'primary',
          },
          ...sx,
        }}
      ></Box>
    </>
  );
});
