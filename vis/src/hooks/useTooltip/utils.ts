export function getAbsoluteBoundingBox(node: HTMLElement): DOMRect {
  const rect = node.getBoundingClientRect();
  const x = rect.left;
  const y = rect.top;
  const width = rect.width;
  const height = rect.height;
  return new DOMRect(x, y, width, height);
}
