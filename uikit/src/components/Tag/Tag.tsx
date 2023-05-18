import { Box } from 'components/Box';
import { FC, PropsWithChildren } from 'react';

export type TagProps = {
  color?: string;
}

export const Tag: FC<PropsWithChildren<TagProps>> = ({
  children,
  color,
}) => {
  return (
    <Box
      color={color}
    >
      {children}
    </Box>
  );
};
