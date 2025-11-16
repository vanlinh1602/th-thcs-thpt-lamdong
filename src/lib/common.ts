import { round } from 'lodash';
import { nanoid } from 'nanoid';

export const generateID = ({
  ids = [],
  size = 10,
  options = { prefix: '', suffix: '', ignore: [] },
}: {
  ids?: string[];
  size?: number;
  options?: { prefix?: string; suffix?: string; ignore?: string[] };
} = {}): string => {
  const id = `${options.prefix ?? ''}${nanoid(size)}${options.suffix ?? ''}`;
  if (ids.includes(id) || options.ignore?.some((ignore) => id.includes(ignore)))
    return generateID({ ids, size, options });
  return id;
};

export const formatNumberCompact = (
  value: number,
  options: { digits?: number; lowerCase?: boolean } = {}
): string => {
  const { digits = 1, lowerCase = true } = options;
  if (!Number.isFinite(value)) return String(value);

  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);

  const units = [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];

  for (const unit of units) {
    if (abs >= unit.value) {
      const raw = (abs / unit.value).toFixed(digits);
      const trimmed = raw.replace(/\.0+$|((?:\.|,)\d*[1-9])0+$/, '$1');
      const symbol = lowerCase ? unit.symbol.toLowerCase() : unit.symbol;
      return `${sign}${trimmed}${symbol}`;
    }
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: Math.max(0, digits),
  }).format(value);
};

export const parseCompactNumber = (text: string): number => {
  if (typeof text !== 'string') return Number(text);
  const normalized = text.trim().replace(/,/g, '').toLowerCase();
  const match = normalized.match(/^(-?\d+(?:\.\d+)?)\s*([kmb])?$/);
  if (!match) return Number.NaN;
  const base = parseFloat(match[1]);
  const suffix = match[2];
  if (suffix === 'k') return base * 1e3;
  if (suffix === 'm') return base * 1e6;
  if (suffix === 'b') return base * 1e9;
  return base;
};

export const compareString = (a: string, b: string): number => {
  // Split strings into parts (text and numbers)
  const partsA = a.match(/\d+|\D+/g) || [];
  const partsB = b.match(/\d+|\D+/g) || [];

  // Compare each part
  for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
    const partA = partsA[i];
    const partB = partsB[i];

    // If both parts are numbers, compare numerically
    if (/^\d+$/.test(partA) && /^\d+$/.test(partB)) {
      const numA = parseInt(partA, 10);
      const numB = parseInt(partB, 10);
      if (numA !== numB) return numA - numB;
    } else {
      // Otherwise compare as strings
      const strCompare = partA.localeCompare(partB);
      if (strCompare !== 0) return strCompare;
    }
  }

  // If all common parts are equal, shorter string comes first
  return partsA.length - partsB.length;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)*[\w-]+\.[a-z]{2,}(\/.*)?\/?$/i;
  return urlRegex.test(url);
};

export const getUrlVersion = (url: string): number => {
  const version = url.split('?v=')?.[1];
  return version ? Number(version) : 0;
};

export const removeAccents = (text: string): string =>
  text
    .replace(/A|Á|À|Ã|Ạ|Ả|Â|Ấ|Ầ|Ẫ|Ậ|Ẩ|Ă|Ắ|Ằ|Ẵ|Ặ|Ẳ/g, 'A')
    .replace(/á|à|ã|ạ|ả|â|ấ|ầ|ẫ|ậ|ẩ|ă|ắ|ằ|ẵ|ặ|ẳ/g, 'a')
    .replace(/E|É|È|Ẽ|Ẹ|Ẻ|Ê|Ế|Ề|Ễ|Ệ|Ể/g, 'E')
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    .replace(/I|Í|Ì|Ĩ|Ị|Ỉ/g, 'I')
    .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    .replace(/O|Ó|Ò|Õ|Ọ|Ỏ|Ô|Ố|Ồ|Ỗ|Ộ|Ổ|Ơ|Ớ|Ờ|Ỡ|Ợ|Ở/g, 'O')
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    .replace(/U|Ú|Ù|Ũ|Ụ|Ủ|Ư|Ứ|Ừ|Ữ|Ự|Ử/g, 'U')
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    .replace(/Y|Ý|Ỳ|Ỹ|Ỵ|Ỷ/g, 'Y')
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    .replace(/Đ/g, 'D')
    .replace(/đ/g, 'd')
    .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '')
    .replace(/\u02C6|\u0306|\u031B/g, '');

export const compareObjects = (a: any, b: any): boolean => {
  if (Object.is(a, b)) return true;

  // Handle nulls and non-objects
  if (
    a === null ||
    b === null ||
    typeof a !== 'object' ||
    typeof b !== 'object'
  ) {
    return false;
  }

  // Dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // RegExp
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!compareObjects(a[i], b[i])) return false;
    }
    return true;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  // Set
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const valueA of a) {
      let found = false;
      for (const valueB of b) {
        if (compareObjects(valueA, valueB)) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }
  if (a instanceof Set !== b instanceof Set) return false;

  // Map
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, valueA] of a) {
      if (!b.has(key)) return false;
      const valueB = b.get(key);
      if (!compareObjects(valueA, valueB)) return false;
    }
    return true;
  }
  if (a instanceof Map !== b instanceof Map) return false;

  // Plain objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!compareObjects(a[key], b[key])) return false;
  }
  return true;
};

export const diffObjectKeys = (a: any, b: any): string[] => {
  const diffs: string[] = [];

  const collectDiffs = (left: any, right: any, path: string) => {
    if (Object.is(left, right)) return;

    // Handle nulls and primitives
    const leftIsObject = left !== null && typeof left === 'object';
    const rightIsObject = right !== null && typeof right === 'object';
    if (!leftIsObject || !rightIsObject) {
      if (!Object.is(left, right)) diffs.push(path || '<root>');
      return;
    }

    // Dates
    if (left instanceof Date && right instanceof Date) {
      if (left.getTime() !== right.getTime()) diffs.push(path || '<root>');
      return;
    }

    // RegExp
    if (left instanceof RegExp && right instanceof RegExp) {
      if (left.toString() !== right.toString()) diffs.push(path || '<root>');
      return;
    }

    // Arrays
    if (Array.isArray(left) && Array.isArray(right)) {
      if (left.length !== right.length) {
        diffs.push(path || '<root>');
        return;
      }
      for (let i = 0; i < left.length; i++) {
        collectDiffs(left[i], right[i], `${path}[${i}]`);
      }
      return;
    }
    if (Array.isArray(left) !== Array.isArray(right)) {
      diffs.push(path || '<root>');
      return;
    }

    // Sets and Maps: treat as a whole for path reporting
    if (
      (left instanceof Set && right instanceof Set) ||
      (left instanceof Map && right instanceof Map)
    ) {
      if (!compareObjects(left, right)) diffs.push(path || '<root>');
      return;
    }

    // Plain objects
    const keys = new Set<string>([...Object.keys(left), ...Object.keys(right)]);
    for (const key of keys) {
      const hasLeft = Object.prototype.hasOwnProperty.call(left, key);
      const hasRight = Object.prototype.hasOwnProperty.call(right, key);
      const nextPath = path ? `${path}.${key}` : key;
      if (!hasLeft || !hasRight) {
        diffs.push(nextPath);
        continue;
      }
      collectDiffs(left[key], right[key], nextPath);
    }
  };

  collectDiffs(a, b, '');
  return diffs;
};

export const formatNumber = (value: string | number = '', dec?: number) =>
  `${dec === undefined ? value : round(Number(value), dec)}`.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );

export const parseNumber = (value: string = '') => {
  const number = value!.replace(/\$\s?|(,*)/g, '');
  return number;
};
