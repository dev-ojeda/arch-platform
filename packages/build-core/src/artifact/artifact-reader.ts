// packages/build-core/src/artifact/artifact-reader.ts

import { pathExists, readJsonFile } from '../fs/fs-async.js';

import { ARTIFACT_SCHEMA_VERSION, type ArtifactManifest } from './artifact-manifest.js';

export async function readArtifactManifest(
  filePath: string,
): Promise<ArtifactManifest | undefined> {
  if (!(await pathExists(filePath))) {
    return undefined;
  }

  const value = await readJsonFile(filePath);

  if (!isArtifactManifest(value)) {
    return undefined;
  }

  return value;
}

function isArtifactManifest(value: unknown): value is ArtifactManifest {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.key === 'string' &&
    Array.isArray(record.outputs) &&
    record.outputs.every((x) => typeof x === 'string') &&
    typeof record.createdAt === 'number' &&
    record.schemaVersion === ARTIFACT_SCHEMA_VERSION
  );
}
