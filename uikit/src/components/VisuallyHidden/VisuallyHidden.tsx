import { cloneElement, FC, isValidElement, ReactElement } from 'react';
import { BoxProps } from '../Box';

export type VisuallyHiddenProps = BoxProps & {
  children: ReactElement<BoxProps>;
}

const visuallyHiddenSx: BoxProps['sx'] = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  'whiteSpace': 'nowrap',
  border: 0,
  'clipPath': 'inset(100%)',
  margin: '-1px',
};

export const VisuallyHidden: FC<VisuallyHiddenProps> = ({ children, sx, ...props }) => {
  if (isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      sx: {
        ...sx,
        ...visuallyHiddenSx,
      },
    });
  }
  return <>{children}</>;
};

