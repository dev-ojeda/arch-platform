// packages/infrastructure/src/versioning/package-version-provider.ts

import type { PackageVersionWriter } from '@arch-platform/platform-model';

import { NodeAsyncFileSystemAdapter } from '../filesystem/adapters/node-async-filesystem-adapter.js';

import { FilesystemPackageVersionWriter } from './filesystem-package-version-writer.js';

export class PackageVersionProvider {
  createWriterForWorkspace(workspaceRoot: string): PackageVersionWriter {
    const filesystem = new NodeAsyncFileSystemAdapter({
      root: workspaceRoot,
    });

    return new FilesystemPackageVersionWriter(filesystem);
  }
}
