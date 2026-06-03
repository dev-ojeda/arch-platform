// packages/tooling/src/runtime/helpers/normalize-output.ts

export function normalizeOutput(value: string | Uint8Array | unknown[] | undefined): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Uint8Array) {
    return Buffer.from(value).toString('utf8');
  }

  if (Array.isArray(value)) {
    return value.join('\n');
  }

  return '';
}
