// packages/infrastructure/src/distribution/artifact-distribution-prepared-state.ts

import type {
  ArtifactDistributionPrepared,
  ArtifactDistributionPreparedState,
} from '@arch-platform/platform-model';

export class MutableArtifactDistributionPreparedState {
  private readonly artifacts: Record<string, ArtifactDistributionPrepared>;

  constructor(state: ArtifactDistributionPreparedState) {
    this.artifacts = {
      ...state.artifacts,
    };
  }

  add(prepared: ArtifactDistributionPrepared): void {
    this.artifacts[prepared.packageName] = prepared;
  }

  toSnapshot(): ArtifactDistributionPreparedState {
    return {
      schemaVersion: 1,
      artifacts: {
        ...this.artifacts,
      },
    };
  }
}
