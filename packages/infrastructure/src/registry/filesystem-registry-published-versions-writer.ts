// packages/infrastructure/src/registry/filesystem-registry-published-versions-writer.ts

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type {
  RegistryPublishedVersions,
  RegistryPublishedVersionsPreparedState,
  RegistryPublishedVersionsWriter,
} from '@arch-platform/platform-model';

import { MutableRegistryPublishedVersionsState } from './registry-published-versions-state.js';

export class FilesystemRegistryPublishedVersionsWriter implements RegistryPublishedVersionsWriter {
  private readonly state: MutableRegistryPublishedVersionsState;

  constructor(
    state: RegistryPublishedVersionsPreparedState,
    private readonly filesystem: FileSystemAsyncPort,
  ) {
    this.state = new MutableRegistryPublishedVersionsState(state);
  }

  getState(): RegistryPublishedVersionsPreparedState {
    return this.state.toSnapshot();
  }

  apply(artifact: string, prepared: RegistryPublishedVersions): void {
    this.state.add(artifact, prepared);
  }

  async write(): Promise<void> {
    const directory = '/.arch-platform/registry';
    const path = `${directory}/registry-state.json`;

    await this.filesystem.createDirectory(directory);
    await this.filesystem.writeJson(path, this.state.toSnapshot());
  }
}
