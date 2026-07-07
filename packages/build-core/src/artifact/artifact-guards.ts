// packages/build-core/src/artifact/artifact-guards.ts

import { ARTIFACT_SCHEMA_VERSION, type ArtifactManifest } from './artifact-manifest.js';
import type { Artifact } from './artifact.js';

export function isArtifact(value: unknown): value is Artifact {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return typeof record.packageName === 'string' && typeof record.id === 'string';
}

export function isArtifactManifest(value: unknown): value is ArtifactManifest {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    isArtifact(record.artifact) &&
    Array.isArray(record.outputs) &&
    record.outputs.every((output) => typeof output === 'string') &&
    typeof record.createdAt === 'number' &&
    record.schemaVersion === ARTIFACT_SCHEMA_VERSION
  );
}
