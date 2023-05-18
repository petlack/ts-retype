import { BoxProps, Flex } from '@theme-ui/components';
import { FC, forwardRef, PropsWithChildren } from 'react';

export type StackProps = BoxProps & {
  direction?: 'row' | 'column';
}

export const Stack: FC<PropsWithChildren<StackProps>> = forwardRef<HTMLDivElement, StackProps>(({
  children,
  direction = 'column',
  ...props
}, ref) => {
  const flexDirection = direction === 'row' ? 'row' : 'column';
  return (
    <Flex {...props} ref={ref} sx={{ ...props.sx, flexDirection }}>
      {children}
    </Flex>
  );
});
