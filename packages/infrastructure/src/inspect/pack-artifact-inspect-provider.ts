// packages/infrastructure/src/inspect/pack-artifact-inspect-provider.ts

import type { PackedReader } from '@arch-platform/platform-model';

import { NodeAsyncFileSystemAdapter } from '../filesystem/adapters/node-async-filesystem-adapter.js';
import { NpmArtifactRegistryReader } from '../versioning/npm-artifact-registry-reader.js';

import { FilesystemPackReader } from './filesystem-pack-reader.js';
import { NodePackInspectAdapter } from './node-pack-inspect-adapter.js';

export class PackArtifactInspectProvider {
  createReaderForWorkspace(workspaceRoot: string): PackedReader {
    const filesystem = new NodeAsyncFileSystemAdapter({
      root: workspaceRoot,
    });

    return new FilesystemPackReader(
      filesystem,
      new NodePackInspectAdapter(),
      new NpmArtifactRegistryReader(),
    );
  }
}
