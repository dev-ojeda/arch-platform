// packages/infrastructure/src/artifact/adapter/filesystem-artifact-state-history-writer.ts

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type {
  ArtifactStateHistory,
  ArtifactStateHistoryWriter,
} from '@arch-platform/platform-model';

export class FilesystemArtifactStateHistoryWriter implements ArtifactStateHistoryWriter {
  constructor(private readonly filesystem: FileSystemAsyncPort) {}
  async write(artifacts: ReadonlyMap<string, ArtifactStateHistory>): Promise<void> {
    const directory = '/.arch-platform/history';
    const path = `${directory}/artifact-state-history.json`;
    await this.filesystem.createDirectory(directory);

    await this.filesystem.writeJson(path, {
      schemaVersion: 1,
      artifacts: Object.fromEntries(artifacts),
    });
  }
}
