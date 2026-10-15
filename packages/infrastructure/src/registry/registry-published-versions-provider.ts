// packages/infrastructure/src/registry/registry-published-versions-provider.ts

import type {
  RegistryPublishedVersionsPreparedState,
  RegistryPublishedVersionsProviderPort,
  RegistryPublishedVersionsReader,
  RegistryPublishedVersionsWriter,
} from '@arch-platform/platform-model';

import { NodeAsyncFileSystemAdapter } from '../filesystem/adapters/node-async-filesystem-adapter.js';

import { FilesystemRegistryPublishedVersionsReader } from './filesystem-registry-published-versions-reader.js';
import { FilesystemRegistryPublishedVersionsWriter } from './filesystem-registry-published-versions-writer.js';

export class RegistryPublishedVersionsProvider implements RegistryPublishedVersionsProviderPort {
  createReaderForWorkspace(workspaceRoot: string): RegistryPublishedVersionsReader {
    return new FilesystemRegistryPublishedVersionsReader(
      new NodeAsyncFileSystemAdapter({ root: workspaceRoot }),
    );
  }

  async createWriterForWorkspace(workspaceRoot: string): Promise<RegistryPublishedVersionsWriter> {
    const filesystem = new NodeAsyncFileSystemAdapter({ root: workspaceRoot });
    const path = '/.arch-platform/registry/registry-state.json';

    const state: RegistryPublishedVersionsPreparedState = (await filesystem.exists(path))
      ? await filesystem.readJson<RegistryPublishedVersionsPreparedState>(path)
      : { schemaVersion: 1, artifacts: {} };

    return new FilesystemRegistryPublishedVersionsWriter(state, filesystem);
  }
}
