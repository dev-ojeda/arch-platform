// packages/infrastructure/src/artifact/adapter/filesystem-artifact-state-writer.ts

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type { ArtifactState, ArtifactStateWriter } from '@arch-platform/platform-model';

export class FilesystemArtifactStateWriter implements ArtifactStateWriter {
  constructor(private readonly filesystem: FileSystemAsyncPort) {}
  async write(artifacts: ReadonlyMap<string, ArtifactState>): Promise<void> {
    const path = '/.arch-platform/artifact-state.json';

    await this.filesystem.createDirectory('/.arch-platform');

    await this.filesystem.writeJson(path, {
      schemaVersion: 1,
      artifacts: Object.fromEntries(artifacts),
    });
  }
}
