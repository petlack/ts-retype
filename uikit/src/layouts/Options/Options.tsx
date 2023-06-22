import { Children, cloneElement, FC, forwardRef, isValidElement, useMemo } from 'react';
import { BoxOwnProps } from '~/components/Box';
import { Assign } from '~/components/types';
import { termix } from '~/termix/termix';
import { useTermix } from '~/termix/useTermix';
import { Stack } from '../Stack';
import { Heading } from '~/components/Heading';
import { Option, getOptionValue, useOptionsGroup } from '~/hooks/useOptionsGroup';
import { VisuallyHidden } from '~/components/VisuallyHidden';
import { Mix } from '~/termix';

export type OptionsOwnProps = {
  name: string;
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export type OptionsProps = Mix<'div', OptionsOwnProps>;

export const Options: FC<OptionsProps> = forwardRef<HTMLDivElement, OptionsProps>((props, ref) => {
  const {
    children,
    sx,
    tx,
    name,
    direction,
    align,
  } = props;
  const { theme } = useTermix();
  const styles = termix(theme, tx, 'options');
  const mergedSx = {
    ...styles,
    ...sx,
  };

  // const { theme } = useTermix();
  //
  // const styles = useTermixStyle(theme, {
  //   element: {} as TermixProps['element'],
  //   ...props,
  // });

  // const mergedSx = {
  //   p: 2,
  //   gap: 2,
  //   ...styles,
  //   ...sx,
  // };

  const options = Children.map(children, getOptionValue<string>) || [];
  const { containerProps, labelProps, itemProps, selectedOption } = useOptionsGroup<string>(name, options);

  const clones = Children.map(
    children,
    (child, idx) => useMemo(() => {
      if (isValidElement(child)) {
        const optionProps: OptionProps = itemProps(child, idx);
        return cloneElement(child, { ...child.props, ...optionProps });
      }
      return child;
    }, [selectedOption === idx]),
  );

  return (
    <>
      <Stack
        ref={ref}
        align='stretch'
        {...containerProps}
        sx={mergedSx}
      >
        <VisuallyHidden>
          <Heading as='h3' {...labelProps}>{name}</Heading>
        </VisuallyHidden>
        {clones}
      </Stack>
    </>
  );
});

export type OptionOwnProps = BoxOwnProps & Option<string>;
export type OptionProps = Assign<React.ComponentPropsWithRef<'div'>, OptionOwnProps>;

export const OptionItem: FC<OptionProps> = forwardRef(({ children, ...props }, ref) => {
  if (isValidElement(children)) {
    return cloneElement(children, { ref, ...props });
  }
  return <>{children}</>;
});
