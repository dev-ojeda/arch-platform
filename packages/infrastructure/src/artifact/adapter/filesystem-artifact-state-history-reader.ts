// packages/infrastructure/src/artifact/adapter/filesystem-artifact-state-history-reader.ts

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type {
  ArtifactStateHistory,
  ArtifactStateHistoryReader,
} from '@arch-platform/platform-model';

interface ArtifactStateHistoryFile {
  readonly schemaVersion: number;
  readonly artifacts: Record<string, ArtifactStateHistory>;
}

export class FilesystemArtifactStateHistoryReader implements ArtifactStateHistoryReader {
  constructor(private readonly filesystem: FileSystemAsyncPort) {}

  async read(): Promise<ReadonlyMap<string, ArtifactStateHistory>> {
    const path = '/.arch-platform/history/artifact-state-history.json';

    if (!(await this.filesystem.exists(path))) {
      return new Map();
    }

    const file = await this.filesystem.readJson<ArtifactStateHistoryFile>(path);

    return new Map(Object.entries(file.artifacts));
  }
}
