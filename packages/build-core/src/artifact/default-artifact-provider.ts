// packages/build-core/src/artifact/default-artifact-provider.ts

import type { HashResult } from '../hash/hash-result.js';

import { createArtifactKey } from './artifact-key.js';
import type { ArtifactProvider } from './artifact-provider.js';
import type { Artifact } from './artifact.js';

export class DefaultArtifactProvider implements ArtifactProvider {
  create(packageName: string, hash: HashResult): Artifact {
    return {
      packageName,
      id: createArtifactKey(hash),
    };
  }
}
