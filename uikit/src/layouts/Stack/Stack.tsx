import { Flex } from '@theme-ui/components';
import { FC, forwardRef } from 'react';
import { BoxOwnProps } from '~/components/Box';
import { Assign } from '~/components/types';
import { useTermixStyle } from '~/termix/termix';
import { useTermix } from '~/termix/useTermix';
import { TermixProps, TermixPropsNames } from '~/termix/types';
import { omit } from 'ramda';

export type StackOwnProps = BoxOwnProps & {
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export type StackProps = Assign<React.ComponentPropsWithRef<'div'>, StackOwnProps>;

export const Stack: FC<StackProps> = forwardRef<HTMLDivElement, StackProps>(({
  children,
  direction = 'column',
  align = 'start',
  sx,
  ...props
}, ref) => {
  const flexDirection: 'row' | 'column' = direction === 'row' ? 'row' : 'column';
  const alignItems = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: undefined,
  }[align];
  const { theme } = useTermix();

  const styles = useTermixStyle(theme, {
    element: {} as TermixProps['element'],
    ...props,
  });

  const mergedSx = {
    flexDirection,
    alignItems,
    ...styles,
    ...sx,
  };

  return (
    <Flex {...omit(TermixPropsNames, props)} ref={ref} sx={mergedSx}>
      {children}
    </Flex>
  );
});
