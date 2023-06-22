import { FC } from 'react';
import { Box } from '~/components/Box';
import { ToastRecord } from './store';

export const Toast: FC<{ toast: ToastRecord }> = ({ toast }) => {
  return (
    <Box
      tx={{
        colorScheme: { success: 'green', error: 'red', info: 'primary' }[toast.kind ?? 'info'],
        fill: 'semi',
        density: 'airy',
      }}
      sx={{ width: '80vw', maxWidth: '30ch', pointerEvents: 'auto' }}
    >{toast.id}{toast.msg}</Box>
  );
};

