import type { IdGenerator } from '@arch-platform/contracts';

export function createTestIdGenerator(value = 'test-execution-id'): IdGenerator {
  return {
    generate: () => value,
  };
}
