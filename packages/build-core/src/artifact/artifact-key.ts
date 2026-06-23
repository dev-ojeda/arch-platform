// packages/build-core/src/artifact/artifact-key.ts

import type { HashResult } from '../hash/hash-result.js';

export function createArtifactKey(hash: HashResult): string {
  return [hash.sourceHash, hash.configHash, hash.depsHash].join('-');
}
