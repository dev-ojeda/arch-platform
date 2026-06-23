// packages/build-core/src/hash/hash-utils.ts

import crypto from 'node:crypto';

export function createHash(value: string | Buffer): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function createObjectHash(value: unknown): string {
  return createHash(JSON.stringify(value));
}
