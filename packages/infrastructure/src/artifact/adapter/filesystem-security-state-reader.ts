// packages/infrastructure/src/artifact/adapter/filesystem-security-state-reader.ts

import type { SecurityState, SecurityStateReader } from '@arch-platform/compliance';
import type { FileSystemAsyncPort, PathService } from '@arch-platform/contracts';

export class FilesystemSecurityStateReader implements SecurityStateReader {
  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}

  async read(root: string): Promise<SecurityState> {
    const path = this.pathService.join(root, '.arch-platform', 'security', `security.json`);

    if (!(await this.filesystem.exists(path))) {
      return {
        schemaVersion: 0,
        artifacts: {},
      };
    }

    return this.filesystem.readJson<SecurityState>(path);
  }
}
