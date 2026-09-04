// packages/infrastructure/src/artifact/artifact-state-history-provider.ts

import type { ArtifactStateHistoryReader, ArtifactStateHistoryWriter } from '@arch/platform-model';

import { NodeAsyncFileSystemAdapter } from '../filesystem/adapters/node-async-filesystem-adapter.js';
import { NodePathService } from '../filesystem/paths/node-path-service.js';

import { FilesystemArtifactStateHistoryReader } from './adapter/filesystem-artifact-state-history-reader.js';
import { FilesystemArtifactStateHistoryWriter } from './adapter/filesystem-artifact-state-history-writer.js';

export class ArtifactStateHistoryProvider {
  createReader(): ArtifactStateHistoryReader {
    return new FilesystemArtifactStateHistoryReader(
      new NodeAsyncFileSystemAdapter(),
      new NodePathService(),
    );
  }

  createWriter(): ArtifactStateHistoryWriter {
    return new FilesystemArtifactStateHistoryWriter(
      new NodeAsyncFileSystemAdapter(),
      new NodePathService(),
    );
  }
}
