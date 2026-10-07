// packages/infrastructure/src/distribution/artifact-distribution-prepared-provider.ts

import type {
  ArtifactDistributionPreparedProviderPort,
  ArtifactDistributionPreparedReader,
  ArtifactDistributionPreparedState,
  ArtifactDistributionPreparedWriter,
} from '@arch-platform/platform-model';

import { NodeAsyncFileSystemAdapter } from '../filesystem/adapters/node-async-filesystem-adapter.js';

import { FilesystemArtifactDistributionReader } from './filesystem-artifact-distribution-prepared-reader.js';
import { FilesystemArtifactDistributionPreparedWriter } from './filesystem-artifact-distribution-prepared-writer.js';

export class ArtifactDistributionPreparedProvider implements ArtifactDistributionPreparedProviderPort {
  createReaderForWorkspace(workspaceRoot: string): ArtifactDistributionPreparedReader {
    return new FilesystemArtifactDistributionReader(
      new NodeAsyncFileSystemAdapter({ root: workspaceRoot }),
    );
  }

  async createWriterForWorkspace(
    workspaceRoot: string,
  ): Promise<ArtifactDistributionPreparedWriter> {
    const filesystem = new NodeAsyncFileSystemAdapter({
      root: workspaceRoot,
    });

    const path = '/.arch-platform/distribution/artifact-distribution.json';

    const state: ArtifactDistributionPreparedState = (await filesystem.exists(path))
      ? await filesystem.readJson<ArtifactDistributionPreparedState>(path)
      : {
          schemaVersion: 1,
          artifacts: {},
        };
    return new FilesystemArtifactDistributionPreparedWriter(state, filesystem);
  }
}
