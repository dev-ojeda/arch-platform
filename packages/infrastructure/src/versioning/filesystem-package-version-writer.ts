// packages/infrastructure/src/versioning/filesystem-package-version-writer.ts

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type { PackageVersionWriter } from '@arch-platform/platform-model';

export class FilesystemPackageVersionWriter implements PackageVersionWriter {
  constructor(private readonly filesystem: FileSystemAsyncPort) {}

  async write(manifestPath: string, version: string): Promise<void> {
    const packageJson = await this.filesystem.readJson<Record<string, unknown>>(manifestPath);
    packageJson.version = version;

    await this.filesystem.writeJson(manifestPath, packageJson);
  }
}
