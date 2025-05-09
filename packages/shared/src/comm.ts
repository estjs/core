import { isArray, isFunction, isString } from './is';

export const _toString = Object.prototype.toString;
export const extend = Object.assign;
const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val =>
  hasOwnProperty.call(val, key);

export function coerceArray<T>(data: T | T[]): T[] {
  return isArray(data) ? (data.flat() as T[]) : [data];
}
export const hasChanged = (value, oldValue) =>
  value !== oldValue && (value === value || oldValue === oldValue);
export const noop = Function.prototype as () => void;

/**
 * A function that checks if a string starts with a specific substring.
 *  indexOf faster under normal circumstances
 * @see https://www.measurethat.net/Benchmarks/Show/12350/0/startswith-vs-test-vs-match-vs-indexof#latest_results_block

 * @param {string} str - The input string to check.
 * @param {string} searchString - The substring to check for at the beginning of the input string.
 * @return {boolean} Returns true if the input string starts with the specified substring, otherwise false.
 */
export function startsWith(str, searchString) {
  if (!isString(str)) {
    return false;
  }
  return str.indexOf(searchString) === 0;
}

/**
 * Escapes special HTML characters in a string.
 * @param str - The string to escape.
 * @returns The escaped string.
 */
export function escape(str: string): string {
  return str.replaceAll(/["&'<>]/g, char => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#039;';
      default:
        return char;
    }
  });
}

export type ExcludeType = ((key: string | symbol) => boolean) | (string | symbol)[];

/**
 * Checks if a key should be excluded based on the provided exclude criteria.
 * @param key - The key to check.
 * @param exclude - The exclusion criteria.
 * @returns True if the key should be excluded, otherwise false.
 */
export function isExclude(key: string | symbol, exclude?: ExcludeType): boolean {
  return isArray(exclude) ? exclude.includes(key) : isFunction(exclude) ? exclude(key) : false;
}

/**
 * Generates a unique random 8 character string ID.
 * The generated IDs only contain alphanumeric characters.
 * @returns A unique random 8 character string ID.
 */
export function generateUniqueId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Checks if the current environment is a browser.
 * @returns True if the current environment is a browser, otherwise false.
 */
export function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null);
  return ((str: string) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  }) as T;
};
