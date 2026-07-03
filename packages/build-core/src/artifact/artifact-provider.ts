// packages/build-core/src/artifact/artifact-provider.ts

import type { HashResult } from '../hash/hash-result.js';

import type { Artifact } from './artifact.js';

export interface ArtifactProvider {
  create(packageName: string, hash: HashResult): Artifact;
}
