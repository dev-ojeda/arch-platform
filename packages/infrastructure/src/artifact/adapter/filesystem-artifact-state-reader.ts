// packages/infrastructure/src/artifact/adapter/filesystem-artifact-state-reader.ts

import type { FileSystemAsyncPort, PathService } from '@arch/contracts';
import type { ArtifactState, ArtifactStateReader } from '@arch/platform-model';

import { getArtifactStatePath } from '../../state/state-paths.js';

interface ArtifactStateFile {
  readonly schemaVersion: number;
  readonly artifacts: Record<string, ArtifactState>;
}

export class FilesystemArtifactStateReader implements ArtifactStateReader {
  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}

  async read(root: string): Promise<ReadonlyMap<string, ArtifactState>> {
    const path = getArtifactStatePath(root, this.pathService);

    if (!(await this.filesystem.exists(path))) {
      return new Map();
    }

    const file = await this.filesystem.readJson<ArtifactStateFile>(path);

    return new Map(Object.entries(file.artifacts));
  }
}
