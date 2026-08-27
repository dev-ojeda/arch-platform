// packages/infrastructure/src/artifact/artifact-state-provider.ts

import type { ArtifactStateReader, ArtifactStateWriter } from '@arch/platform-model';

import { NodeAsyncFileSystemAdapter } from '../filesystem/adapters/node-async-filesystem-adapter.js';
import { NodePathService } from '../filesystem/paths/node-path-service.js';

import { FilesystemArtifactStateReader } from './adapter/filesystem-artifact-state-reader.js';
import { FilesystemArtifactStateWriter } from './adapter/filesystem-artifact-state-writer.js';

export class ArtifactStateProvider {
  createReader(): ArtifactStateReader {
    return new FilesystemArtifactStateReader(
      new NodeAsyncFileSystemAdapter(),
      new NodePathService(),
    );
  }

  createWriter(): ArtifactStateWriter {
    return new FilesystemArtifactStateWriter(
      new NodeAsyncFileSystemAdapter(),
      new NodePathService(),
    );
  }
}
