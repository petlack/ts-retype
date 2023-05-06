type Enumlike = Record<string | number, string | number>;

export function safeToEnumValue<T extends Enumlike>(
  enumObj: T,
  value: number | symbol | keyof T | T[keyof T],
): T[keyof T] | undefined {
  if (typeof value === 'number') {
    const enumValue = Object.keys(enumObj).find((key) => enumObj[key as keyof T] === value);
    if (enumValue !== undefined) {
      return enumObj[enumValue as keyof T];
    }
  } else if (typeof value === 'string' && Object.keys(enumObj).includes(value)) {
    return enumObj[value as keyof T];
  } else if (enumObj[value as keyof T] !== undefined) {
    return enumObj[value as keyof T];
  }
  return undefined;
}

export function toEnumValue<T extends Enumlike>(
  enumObj: T,
  value: number | symbol | string | null | undefined,
): T[keyof T] | undefined {
  return safeToEnumValue(enumObj, value as keyof T);
}

export function enumToString<T extends Enumlike>(
  enumObj: T,
  val: number | symbol | string | null | undefined | keyof T | T[keyof T],
): string | undefined {
  const res = toEnumValue(enumObj, val);
  if (res == null) {
    return undefined;
  }
  return enumObj[res]?.toString();
}

export function getEnumValues<T extends Enumlike>(enumType: T): string[] {
  return Object.keys(enumType).filter((k) => Number.isNaN(parseInt(k)));
}
