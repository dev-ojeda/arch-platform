// packages/infrastructure/src/runtime/node-id-generator.ts

import { randomUUID } from 'node:crypto';

import type { IdGenerator } from '@arch/contracts/runtime';

export class NodeIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
