// packages/build-core/src/artifact/artifact-manifest.ts

export interface ArtifactManifest {
  readonly key: string;

  readonly outputs: string[];

  readonly createdAt: number;

  readonly schemaVersion: number;
}

export const ARTIFACT_SCHEMA_VERSION = 1;
