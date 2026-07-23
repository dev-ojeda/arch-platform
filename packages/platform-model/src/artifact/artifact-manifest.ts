// packages/platform-model/src/artifact/artifact-manifest.ts

import type { Artifact } from './artifact.js';

export interface ArtifactManifest {
  readonly artifact: Artifact;

  readonly outputs: string[];

  readonly createdAt: number;

  readonly schemaVersion: number;
}

export const ARTIFACT_SCHEMA_VERSION = 1;
