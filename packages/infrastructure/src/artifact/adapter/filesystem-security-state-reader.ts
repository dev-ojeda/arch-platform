// packages/infrastructure/src/artifact/adapter/filesystem-security-state-reader.ts

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type { SecurityState, SecurityStateReader } from '@arch-platform/platform-model';

export class FilesystemSecurityStateReader implements SecurityStateReader {
  constructor(private readonly filesystem: FileSystemAsyncPort) {}

  async read(): Promise<SecurityState> {
    const path = '/.arch-platform/security/security.json';

    if (!(await this.filesystem.exists(path))) {
      return {
        schemaVersion: 0,
        artifacts: {},
      };
    }

    return this.filesystem.readJson<SecurityState>(path);
  }
}
