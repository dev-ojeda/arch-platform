// packages/testing/src/hash/create-test-hash-result.ts

import type { HashResult } from '@arch/platform-model';

export function createTestHashResult(overrides?: Partial<HashResult>): HashResult {
  return {
    hash: 'hash',
    sourceHash: 'source',
    configHash: 'config',
    depsHash: 'deps',
    schemaVersion: 1,
    ...overrides,
  };
}
