// packages/build-core/src/artifact/artifact-cache.ts

import type { Artifact } from './artifact.js';

/**
 * Defines the contract for storing and restoring build artifacts.
 *
 * Implementations may use different storage mechanisms, but consumers
 * should not depend on the underlying persistence strategy.
 */
export interface ArtifactCache {
  save(artifact: Artifact, root: string, outputs: readonly string[]): Promise<void>;

  restore(artifact: Artifact, root: string): Promise<boolean>;
}
