import { FC, CSSProperties, PropsWithChildren } from 'react';
import { useTheme } from 'theme';
import { filterFalsy } from 'utils';

export type BoxProps = {
  color?: string;
}

export const Box: FC<PropsWithChildren<BoxProps>> = ({
  children,
  color,
}) => {
  const { theme } = useTheme();
  const resolvedColor = color && theme.colors[color];
  const style: CSSProperties = filterFalsy({
    backgroundColor: resolvedColor && resolvedColor.toString(),
  });
  return (
    <span
      style={style}
    >
      {children}
    </span>
  );
};
