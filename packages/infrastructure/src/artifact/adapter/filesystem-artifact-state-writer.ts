// packages/infrastructure/src/artifact/adapter/filesystem-artifact-state-writer.ts

import type { FileSystemAsyncPort, PathService } from '@arch/contracts';
import type { ArtifactState, ArtifactStateWriter } from '@arch/platform-model';

import { getArtifactStatePath } from '../../state/state-paths.js';

export class FilesystemArtifactStateWriter implements ArtifactStateWriter {
  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}
  async write(root: string, artifacts: ReadonlyMap<string, ArtifactState>): Promise<void> {
    const path = getArtifactStatePath(root, this.pathService);
    await this.filesystem.createDirectory(this.pathService.dirname(path));

    await this.filesystem.writeJson(path, {
      schemaVersion: 1,
      artifacts: Object.fromEntries(artifacts),
    });
  }
}
