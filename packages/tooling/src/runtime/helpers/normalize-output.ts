// packages/tooling/src/runtime/helpers/normalize-output.ts

import { safeStringify } from '../../serialization/safe-stringify.js';

export function normalizeOutput(value: string | Uint8Array | unknown[] | undefined): string {
  if (value == null) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Uint8Array) {
    return Buffer.from(value).toString('utf8');
  }

  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === 'string' ? v : safeStringify(v))).join('\n');
  }

  return safeStringify(value);
}
