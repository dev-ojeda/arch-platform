// packages/infrastructure/src/hashing/node-hash-service.ts

import { createHash } from 'node:crypto';

import type { HashService, HashValue } from '@arch/contracts';

import { safeStringify } from '../serialization/safe-stringify.js';

export class NodeHashService implements HashService {
  hash(value: HashValue): string {
    return createHash('sha256').update(value).digest('hex');
  }

  hashObject(value: unknown): string {
    return this.hash(safeStringify(value));
  }
}
