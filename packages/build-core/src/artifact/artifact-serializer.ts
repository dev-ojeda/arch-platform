// packages/build-core/src/artifact/artifact-serializer.ts

import { safeParse, safeStringify } from '../serialization/index.js';

import { isArtifactManifest } from './artifact-guards.js';
import type { ArtifactManifest } from './artifact-manifest.js';

export function serializeArtifactManifest(manifest: ArtifactManifest): string {
  return safeStringify(manifest);
}

export function deserializeArtifactManifest(content: string): ArtifactManifest | undefined {
  const value = safeParse(content);

  return isArtifactManifest(value) ? value : undefined;
}
