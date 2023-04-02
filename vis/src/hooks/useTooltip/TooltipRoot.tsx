import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function TooltipRoot() {
  return (
    <div id='tooltip-root'></div>
  );
}

export const TooltipPortal = (node: ReactNode) => {
  const root = document.getElementById('tooltip-root');
  if (!root) {
    return;
  }
  return createPortal(node, root);
};