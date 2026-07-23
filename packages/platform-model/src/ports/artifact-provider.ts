// packages/platform-model/src/ports/artifact-provider.ts

import type { Artifact } from '../artifact/artifact.js';
import type { HashResult } from '../hashing/hash-result.js';

/**
 * Creates artifact metadata associated with a build execution.
 *
 * Implementations define how artifacts are represented,
 * while build execution remains independent of that detail.
 */
export interface ArtifactProvider {
  create(packageName: string, hash: HashResult): Artifact;
}
