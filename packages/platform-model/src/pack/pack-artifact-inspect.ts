// packages/platform-model/src/pack/pack-artifact-inspect.ts

import type { ArtifactRegistrationStatus } from '../distribution/artifact-registration-status.js';

import type { PackInspection } from './pack-inspection.js';

export interface PackedArtifactInspect {
  readonly artifactRegistryStatus: ArtifactRegistrationStatus;
  readonly artifact: string;
  readonly file: string;
  readonly size: number;
  readonly package: PackInspection;
  readonly integrity: {
    readonly calculated: string;
    readonly expected?: string;
    readonly matches?: boolean;
  };
}
