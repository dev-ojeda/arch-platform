// packages/infrastructure/src/artifact/artifact-state-provider.ts

import type { ArtifactStateReader, ArtifactStateWriter } from '@arch-platform/platform-model';

import { NodeAsyncFileSystemAdapter } from '../filesystem/adapters/node-async-filesystem-adapter.js';

import { FilesystemArtifactStateReader } from './adapter/filesystem-artifact-state-reader.js';
import { FilesystemArtifactStateWriter } from './adapter/filesystem-artifact-state-writer.js';

export class ArtifactStateProvider {
  createReaderForWorkspace(workspaceRoot: string): ArtifactStateReader {
    return new FilesystemArtifactStateReader(
      new NodeAsyncFileSystemAdapter({ root: workspaceRoot }),
    );
  }

  createWriterForWorkspace(workspaceRoot: string): ArtifactStateWriter {
    return new FilesystemArtifactStateWriter(
      new NodeAsyncFileSystemAdapter({ root: workspaceRoot }),
    );
  }

  async assertArtifactStateExistsForWorkspace(workspaceRoot: string): Promise<void> {
    const filesystem = new NodeAsyncFileSystemAdapter({ root: workspaceRoot });
    const path = '/.arch-platform/artifact-state.json';

    if (!(await filesystem.exists(path))) {
      throw new Error(
        `Compliance requires artifact state file "${path}" in workspace "${workspaceRoot}".`,
      );
    }
  }
}
