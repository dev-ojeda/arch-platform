// packages/testing/src/runtime/create-test-id-generator.ts

import type { IdGenerator } from '@arch/contracts/runtime';

export function createTestIdGenerator(value = 'test-execution-id'): IdGenerator {
  return {
    generate: () => value,
  };
}
