// packages/infrastructure/src/artifact/adapter/filesystem-artifact-state-history-writer.ts

import type { FileSystemAsyncPort, PathService } from '@arch/contracts';
import type { ArtifactStateHistory, ArtifactStateHistoryWriter } from '@arch/platform-model';

export class FilesystemArtifactStateHistoryWriter implements ArtifactStateHistoryWriter {
  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}
  async write(root: string, artifacts: ReadonlyMap<string, ArtifactStateHistory>): Promise<void> {
    const directory = this.pathService.join(root, '.arch', 'history');

    const path = this.pathService.join(directory, `artifact-state-history.json`);
    await this.filesystem.createDirectory(directory);

    await this.filesystem.writeJson(path, {
      schemaVersion: 1,
      artifacts: Object.fromEntries(artifacts),
    });
  }
}
