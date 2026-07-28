// packages\infrastructure\test\helpers\create-artifact-manifest.ts
import { ARTIFACT_SCHEMA_VERSION } from '@arch/platform-model';
import type { Artifact, ArtifactManifest } from '@arch/platform-model';

export function createArtifactManifest(options?: {
  artifact?: Partial<Artifact>;
  outputs?: string[];
  createdAt?: number;
  schemaVersion?: number;
}): ArtifactManifest {
  return {
    artifact: {
      packageName: '@arch/build-core',
      id: 'artifact-id',
      ...options?.artifact,
    },
    outputs: options?.outputs ?? ['dist'],
    createdAt: options?.createdAt ?? 1,
    schemaVersion: options?.schemaVersion ?? ARTIFACT_SCHEMA_VERSION,
  };
}
