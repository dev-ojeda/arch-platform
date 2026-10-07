// packages/infrastructure/src/distribution/filesystem-artifact-distribution-prepared-writer.ts

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type {
  ArtifactDistributionPrepared,
  ArtifactDistributionPreparedState,
  ArtifactDistributionPreparedWriter,
} from '@arch-platform/platform-model';

import { MutableArtifactDistributionPreparedState } from './artifact-distribution-prepared-state.js';

export class FilesystemArtifactDistributionPreparedWriter implements ArtifactDistributionPreparedWriter {
  private readonly state: MutableArtifactDistributionPreparedState;

  constructor(
    state: ArtifactDistributionPreparedState,
    private readonly filesystem: FileSystemAsyncPort,
  ) {
    this.state = new MutableArtifactDistributionPreparedState(state);
  }
  getState(): ArtifactDistributionPreparedState {
    return this.state.toSnapshot();
  }

  apply(prepared: ArtifactDistributionPrepared): void {
    this.state.add(prepared);
  }

  async write(): Promise<void> {
    const directory = '/.arch-platform/distribution';
    const path = `${directory}/artifact-distribution.json`;

    await this.filesystem.createDirectory(directory);
    await this.filesystem.writeJson(path, this.state.toSnapshot());
  }
}
