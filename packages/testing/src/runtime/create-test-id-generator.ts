// packages/testing/src/runtime/create-test-id-generator.ts

import type { IdGenerator } from '@arch/contracts';

export function createTestIdGenerator(): IdGenerator {
  return {
    generate: () => 'test-id',
  };
}
