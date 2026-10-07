// packages/infrastructure/src/distribution/filesystem-artifact-distribution-prepared-reader.ts

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type {
  ArtifactDistributionPrepared,
  ArtifactDistributionPreparedReader,
  ArtifactDistributionPreparedState,
} from '@arch-platform/platform-model';

export class FilesystemArtifactDistributionReader implements ArtifactDistributionPreparedReader {
  constructor(private readonly filesystem: FileSystemAsyncPort) {}

  async read(artifact: string): Promise<ArtifactDistributionPrepared | undefined> {
    const path = '/.arch-platform/distribution/artifact-distribution.json';

    if (!(await this.filesystem.exists(path))) {
      return undefined;
    }

    const state = await this.filesystem.readJson<ArtifactDistributionPreparedState>(path);

    return state.artifacts[artifact];
  }
}
