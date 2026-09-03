import type { HashResult } from '@arch/platform-model';

export function createHashResult(): HashResult {
  return {
    hash: 'test-hash',
    sourceHash: 'test-source-hash',
    configHash: 'test-config-hash',
    depsHash: 'test-deps-hash',
    schemaVersion: 1,
  };
}
