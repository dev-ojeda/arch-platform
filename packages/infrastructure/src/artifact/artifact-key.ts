// packages/infrastructure/src/artifact/artifact-key.ts

import type { HashResult } from '@arch/platform-model';

export function createArtifactKey(hash: HashResult): string {
  return [hash.sourceHash, hash.configHash, hash.depsHash].join('-');
}
