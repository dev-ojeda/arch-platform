// packages/build-core/src/artifact/artifact-reader.ts

import { pathExists, readJsonFile } from '../fs/fs-async.js';

import { isArtifactManifest } from './artifact-guards.js';
import type { ArtifactManifest } from './artifact-manifest.js';

export async function readArtifactManifest(
  filePath: string,
): Promise<ArtifactManifest | undefined> {
  if (!(await pathExists(filePath))) {
    return undefined;
  }

  const value = await readJsonFile(filePath);

  return isArtifactManifest(value) ? value : undefined;
}
