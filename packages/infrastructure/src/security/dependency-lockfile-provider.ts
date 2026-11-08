// packages/infrastructure/src/security/dependency-lockfile-provider.ts

import type { DependencyLockfileReader } from '@arch-platform/platform-model';


import { DefaultDependencyLockfileAdapter } from './dependency-lockfile/dependency-lock-file-adapter.js';
import { FilesystemDependencyLockfileReader } from './dependency-lockfile/filesystem-lock-file-reader.js';
import { NodeAsyncFileSystemAdapter } from '../filesystem/adapters/node-async-filesystem-adapter.js';

export class DependencyLockfileProvider {
  createReader(workspaceRoot: string): DependencyLockfileReader {
    const filesystem = new NodeAsyncFileSystemAdapter({
      root: workspaceRoot,
    });

    const adapter = new DefaultDependencyLockfileAdapter(filesystem);

    return new FilesystemDependencyLockfileReader(adapter);
  }
}
