// packages/infrastructure/src/security/dependency-lockfile/filesystem-lock-file-reader.ts

import type { PathService } from '@arch-platform/contracts';
import type {
  DependencyLockfile,
  DependencyLockfileAdapter,
  DependencyLockfileReader,
} from '@arch-platform/platform-model';

export class FilesystemDependencyLockfileReader implements DependencyLockfileReader {
  constructor(
    private readonly pathService: PathService,
    private readonly adapter: DependencyLockfileAdapter,
  ) {}

  async read(workspaceRoot: string, lockfilePath: string): Promise<DependencyLockfile> {
    const path = this.pathService.resolve(workspaceRoot, lockfilePath);
    return this.adapter.adapt(path);
  }
}
