// packages\infrastructure\test\helpers\create-artifact-manifest.ts
import type { Artifact, ArtifactManifest, OutputFingerprint } from '@arch-platform/platform-model';

import { ARTIFACT_SCHEMA_VERSION } from '../../src/artifact/artifact-schema-version.js';

export function createArtifactManifest(options?: {
  artifact?: Partial<Artifact>;
  outputs?: string[];
  outputFingerprint?: OutputFingerprint[];
  createdAt?: number;
  schemaVersion?: number;
}): ArtifactManifest {
  const outputs = options?.outputs ?? ['dist'];

  return {
    artifact: {
      packageName: '@arch-platform/build-core',
      id: 'artifact-id',
      ...options?.artifact,
    },
    outputs,
    outputFingerprint:
      options?.outputFingerprint ??
      outputs.map((path) => ({
        path,
        sizeInBytes: 10,
        integrity: `sha256:${'a'.repeat(64)}`,
      })),
    createdAt: options?.createdAt ?? 1,
    schemaVersion: options?.schemaVersion ?? ARTIFACT_SCHEMA_VERSION,
  };
}
