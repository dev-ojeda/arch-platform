// packages/platform-model/src/distribution/artifact-distribution-prepared-writer.ts

import type { ArtifactDistributionPreparedState } from './artifact-distribution-prepared-state.js';
import type { ArtifactDistributionPrepared } from './artifact-distribution-prepared.js';

export interface ArtifactDistributionPreparedWriter {
  apply(prepared: ArtifactDistributionPrepared): void;
  getState(): ArtifactDistributionPreparedState;
  write(): Promise<void>;
}
