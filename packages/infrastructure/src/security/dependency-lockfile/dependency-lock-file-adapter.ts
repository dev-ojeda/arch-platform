// packages/infrastructure/src/security/dependency-lockfile/dependency-lock-file-adapter.ts

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type { DependencyLockfile, DependencyLockfileAdapter } from '@arch-platform/platform-model';

import { parseYaml } from '../../serialization/parse-yaml.js';

export class DefaultDependencyLockfileAdapter implements DependencyLockfileAdapter {
  constructor(private readonly fileSystem: FileSystemAsyncPort) {}

  async adapt(path: string): Promise<DependencyLockfile> {
    const file = await this.fileSystem.read(path);
    return parseYaml<DependencyLockfile>(file);
  }
}
