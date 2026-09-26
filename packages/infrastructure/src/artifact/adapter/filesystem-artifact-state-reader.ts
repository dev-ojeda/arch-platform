// packages/infrastructure/src/artifact/adapter/filesystem-artifact-state-reader.ts

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type { ArtifactState, ArtifactStateReader } from '@arch-platform/platform-model';

interface ArtifactStateFile {
  readonly schemaVersion: number;
  readonly artifacts: Record<string, ArtifactState>;
}

export class FilesystemArtifactStateReader implements ArtifactStateReader {
  constructor(private readonly filesystem: FileSystemAsyncPort) {}

  async read(): Promise<ReadonlyMap<string, ArtifactState>> {
    const path = '/.arch-platform/artifact-state.json';

    if (!(await this.filesystem.exists(path))) {
      return new Map();
    }

    const file = await this.filesystem.readJson<ArtifactStateFile>(path);

    return new Map(Object.entries(file.artifacts));
  }
}
