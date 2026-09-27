// packages/infrastructure/src/artifact/artifact-state-history-provider.ts

import type {
  ArtifactStateHistoryReader,
  ArtifactStateHistoryWriter,
} from '@arch-platform/platform-model';

import { NodeAsyncFileSystemAdapter } from '../filesystem/adapters/node-async-filesystem-adapter.js';

import { FilesystemArtifactStateHistoryReader } from './adapter/filesystem-artifact-state-history-reader.js';
import { FilesystemArtifactStateHistoryWriter } from './adapter/filesystem-artifact-state-history-writer.js';

export class ArtifactStateHistoryProvider {
  createReaderForWorkspace(workspaceRoot: string): ArtifactStateHistoryReader {
    return new FilesystemArtifactStateHistoryReader(
      new NodeAsyncFileSystemAdapter({ root: workspaceRoot }),
    );
  }

  createWriterForWorkspace(workspaceRoot: string): ArtifactStateHistoryWriter {
    return new FilesystemArtifactStateHistoryWriter(
      new NodeAsyncFileSystemAdapter({ root: workspaceRoot }),
    );
  }
}
