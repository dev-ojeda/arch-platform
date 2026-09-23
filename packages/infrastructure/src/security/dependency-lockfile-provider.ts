// packages/infrastructure/src/security/dependency-lockfile-provider.ts

import type { DependencyLockfileReader } from '@arch-platform/platform-model';

import { NodeAsyncFileSystemAdapter } from '../filesystem/adapters/node-async-filesystem-adapter.js';
import { NodePathService } from '../filesystem/paths/node-path-service.js';

import { DefaultDependencyLockfileAdapter } from './dependency-lockfile/dependency-lock-file-adapter.js';
import { FilesystemDependencyLockfileReader } from './dependency-lockfile/filesystem-lock-file-reader.js';

export class DependencyLockfileProvider {
  createReader(workspaceRoot: string): DependencyLockfileReader {
    const filesystem = new NodeAsyncFileSystemAdapter({
      root: workspaceRoot,
    });

    const pathService = new NodePathService();
    const adapter = new DefaultDependencyLockfileAdapter(filesystem);

    return new FilesystemDependencyLockfileReader(pathService, adapter);
  }
}
