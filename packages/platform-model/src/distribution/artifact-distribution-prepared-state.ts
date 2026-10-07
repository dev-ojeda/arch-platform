// packages/platform-model/src/distribution/artifact-distribution-prepared-state.ts

import type { ArtifactDistributionPrepared } from './artifact-distribution-prepared.js';

export interface ArtifactDistributionPreparedState {
  readonly schemaVersion: number;
  readonly artifacts: Readonly<Record<string, ArtifactDistributionPrepared>>;
}
