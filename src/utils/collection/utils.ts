import type { Callback } from "./types";

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isRecord<T>(value: unknown): value is Record<keyof any, T> {
  return value !== null && typeof value === "object" && !isArray(value);
}

export function getNestedValue<T>(value: T, key: string | number): unknown {
  try {
    return key
      .toString()
      .split(".")
      .reduce((carry, property) => (carry as any)[property], value);
  } catch (error) {
    return value;
  }
}

export function resolveKey<T>(
  key: string | number,
  value: T,
  keyOrCallback:
    | (string | number)
    | Callback<string | number, [T, string | number]>
): string | number {
  if (typeof keyOrCallback === "function") {
    return keyOrCallback(value, key);
  }

  if (isRecord<T>(value)) {
    return getNestedValue(value, keyOrCallback) as string | number;
  }

  return "";
}

export function arrayToRecord<T>(array: T[]): Record<string, T> {
  const result = {} as Record<string, T>;

  array.forEach((value, index) => {
    result[index] = value;
  });

  return result;
}
