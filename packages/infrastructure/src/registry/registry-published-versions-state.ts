// packages/infrastructure/src/registry/registry-published-versions-state.ts

import type {
  RegistryPublishedVersions,
  RegistryPublishedVersionsPreparedState,
} from '@arch-platform/platform-model';

export class MutableRegistryPublishedVersionsState {
  private readonly artifacts: Record<string, RegistryPublishedVersions>;

  constructor(state: RegistryPublishedVersionsPreparedState) {
    this.artifacts = {
      ...state.artifacts,
    };
  }

  add(artifact: string, prepared: RegistryPublishedVersions): void {
    this.artifacts[artifact] = prepared;
  }

  toSnapshot(): RegistryPublishedVersionsPreparedState {
    return {
      schemaVersion: 1,
      artifacts: {
        ...this.artifacts,
      },
    };
  }
}
