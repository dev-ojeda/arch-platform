// packages/infrastructure/src/artifact/adapter/filesystem-output-validator.ts

import type { FileSystemAsyncPort, PathService } from '@arch/contracts';
import type { OutputValidator } from '@arch/platform-model';

export class FilesystemOutputValidator implements OutputValidator {
  constructor(
    private readonly fileSystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}

  async exists(root: string, outputs: string[]): Promise<boolean> {
    for (const output of outputs) {
      const exists = await this.fileSystem.exists(this.pathService.join(root, output));

      if (!exists) {
        return false;
      }
    }

    return true;
  }
}
