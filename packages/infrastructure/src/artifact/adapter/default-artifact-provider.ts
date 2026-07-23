// packages/infrastructure/src/artifact/adapter/default-artifact-provider.ts

import type { Artifact, ArtifactProvider, HashResult } from '@arch/platform-model';

export class DefaultArtifactProvider implements ArtifactProvider {
  create(packageName: string, hash: HashResult): Artifact {
    return {
      packageName,
      id: createArtifactKey(hash),
    };
  }
}

function createArtifactKey(hash: HashResult): string {
  return `${hash.sourceHash}-${hash.configHash}-${hash.depsHash}`;
}
