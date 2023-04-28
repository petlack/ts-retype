export function getEnumValue<T extends object>(value: unknown, enumType: T): T[keyof T] | null {
  if (typeof value === 'string') {
    const val = Object.keys(enumType).find((k) => k === value);
    return val ? enumType[val as keyof T] : null;
  }
  const val = Object.keys(enumType).find((k) => typeof k === 'string' && parseInt(k) === value);
  return val ? enumType[val as keyof T] : null;
}

export function getEnumValues<T extends object>(enumType: T): string[] {
  return Object.keys(enumType).filter((k) => Number.isNaN(parseInt(k)));
}
