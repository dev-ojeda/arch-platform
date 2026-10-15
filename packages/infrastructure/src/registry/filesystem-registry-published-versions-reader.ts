// packages/infrastructure/src/registry/filesystem-registry-published-versions-reader.ts

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type {
  RegistryPublishedVersions,
  RegistryPublishedVersionsPreparedState,
  RegistryPublishedVersionsReader,
} from '@arch-platform/platform-model';

export class FilesystemRegistryPublishedVersionsReader implements RegistryPublishedVersionsReader {
  constructor(private readonly filesystem: FileSystemAsyncPort) {}

  async read(artifact: string): Promise<RegistryPublishedVersions | undefined> {
    const path = '/.arch-platform/registry/registry-state.json';

    if (!(await this.filesystem.exists(path))) {
      return undefined;
    }

    const state = await this.filesystem.readJson<RegistryPublishedVersionsPreparedState>(path);

    return state.artifacts[artifact];
  }
}
