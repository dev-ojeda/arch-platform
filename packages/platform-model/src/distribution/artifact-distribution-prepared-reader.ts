// packages/platform-model/src/distribution/artifact-distribution-prepared-reader.ts

import type { ArtifactDistributionPrepared } from './artifact-distribution-prepared.js';

export interface ArtifactDistributionPreparedReader {
  read(artifact: string): Promise<ArtifactDistributionPrepared | undefined>;
}
