import { randomUUID } from 'node:crypto';

import type { IdGenerator } from '@arch-platform/contracts';

export class NodeIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
