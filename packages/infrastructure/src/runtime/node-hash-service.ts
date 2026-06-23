// packages/infrastructure/src/runtime/node-hash-service.ts

import crypto from 'node:crypto';

import type { HashService } from '@arch/contracts';

export class NodeHashService implements HashService {
  hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }
}
