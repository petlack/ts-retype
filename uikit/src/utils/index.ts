export function filterFalsy(obj: any): any {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => (typeof v === 'string' && v) || v),
  );
}
