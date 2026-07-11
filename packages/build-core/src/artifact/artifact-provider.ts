// packages/build-core/src/artifact/artifact-provider.ts

import type { HashResult } from '../hash/hash-result.js';

import type { Artifact } from './artifact.js';
/**
 * Creates artifact metadata associated with a build execution.
 *
 * Implementations define how artifacts are represented,
 * while build execution remains independent of that detail.
 */
export interface ArtifactProvider {
  create(packageName: string, hash: HashResult): Artifact;
}
