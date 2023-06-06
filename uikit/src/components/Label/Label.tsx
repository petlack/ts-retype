import { ComponentPropsWithRef, forwardRef } from 'react';
import { TermixPropsNames } from '~/termix/types';
import { Box, BoxOwnProps } from '../Box';
import { Assign, ForwardRef } from '../types';
import { omit } from 'ramda';

export type LabelProps = Assign<ComponentPropsWithRef<'label'>, BoxOwnProps>

export const Label: ForwardRef<HTMLLabelElement, LabelProps> = forwardRef(({ children, sx, ...rest }, ref) => {
  const boxProps = omit(TermixPropsNames, rest);
  return (
    <Box ref={ref} as='label' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, ...sx }} {...boxProps}>
      {children}
    </Box>
  );
});
