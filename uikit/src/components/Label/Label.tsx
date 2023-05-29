import { ComponentPropsWithRef, forwardRef } from 'react';
import { Box, BoxOwnProps } from '../Box';
import { Assign, ForwardRef } from '../types';

export type LabelProps = Assign<ComponentPropsWithRef<'label'>, BoxOwnProps>

export const Label: ForwardRef<HTMLLabelElement, LabelProps> = forwardRef(({ children }, ref) => {
  return (
    <Box ref={ref} as='label' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {children}
    </Box>
  );
});
