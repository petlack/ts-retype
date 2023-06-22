import { forwardRef } from 'react';
import { ForwardRef } from '../types';
import { Box } from '../Box';
import { Mix } from '~/termix/tx';

type RadioOwnProps = {
  selectedIndex?: number;
}

export type RadioProps = Mix<'input', RadioOwnProps>;

export const Radio: ForwardRef<HTMLInputElement, RadioProps> = forwardRef((props, ref) => {
  const {
    className,
    sx,
    tx,
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
        element='input'
        tx={{ ...tx, variant: 'radio' }}
        sx={sx}
      ></Box>
    </>
  );
});
