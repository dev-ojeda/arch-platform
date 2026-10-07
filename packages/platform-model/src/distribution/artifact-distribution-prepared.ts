// packages/platform-model/src/distribution/artifact-distribution-prepared.ts

import type { ArtifactRegistrationStatus } from './artifact-registration-status.js';

export interface ArtifactDistributionPrepared {
  readonly artifactRegistryStatus: ArtifactRegistrationStatus;
  readonly artifact: string;
  readonly file: string;
  readonly packageName: string;
  readonly version: string;
  readonly integrityCalculated: boolean;
  readonly integrityMatches?: boolean;
  readonly integrityResolved: boolean;
}
