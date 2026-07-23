// packages/contracts/src/hashing/hash-service.ts

import type { HashValue } from './hash-value.js';

export interface HashService {
  hash(value: HashValue): string;

  hashObject(value: unknown): string;
}
