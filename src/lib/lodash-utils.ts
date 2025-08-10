import {
  debounce,
  throttle,
  isEmpty,
  isEqual,
  cloneDeep,
  get,
  set,
} from "lodash";

// Debounce utility
export const debounceFn = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
) => debounce(func, wait);

// Throttle utility
export const throttleFn = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
) => throttle(func, wait);

// Object utilities
export const isEmptyObject = (obj: unknown): boolean => isEmpty(obj);
export const deepEqual = (a: unknown, b: unknown): boolean => isEqual(a, b);
export const deepClone = <T>(obj: T): T => cloneDeep(obj);

// Safe get/set utilities
export const safeGet = (
  object: unknown,
  path: string,
  defaultValue?: unknown
) => {
  return get(object, path, defaultValue);
};

export const safeSet = (
  object: Record<string, unknown>,
  path: string,
  value: unknown
) => {
  return set(object, path, value);
};

// Array utilities
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// String utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
};
