// packages/build-core/src/artifact/artifact-cache.ts

import type { Artifact } from './artifact.js';

/**
 * Stores and restores build artifacts.
 *
 * Implementations define the persistence mechanism.
 *
 * restore() returns false when the artifact
 * cannot be restored (missing, invalid or incomplete).
 */
export interface ArtifactCache {
  save(artifact: Artifact, root: string, outputs: readonly string[]): Promise<void>;

  restore(artifact: Artifact, root: string): Promise<boolean>;
}
