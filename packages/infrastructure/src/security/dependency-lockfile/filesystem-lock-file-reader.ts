// packages/infrastructure/src/security/dependency-lockfile/filesystem-lock-file-reader.ts

import type {
  DependencyLockfile,
  DependencyLockfileAdapter,
  DependencyLockfileReader,
} from '@arch-platform/platform-model';

export class FilesystemDependencyLockfileReader implements DependencyLockfileReader {
  constructor(private readonly adapter: DependencyLockfileAdapter) {}

  async read(_workspaceRoot: string, lockfilePath: string): Promise<DependencyLockfile> {
    return this.adapter.adapt(lockfilePath);
  }
}
