// packages/infrastructure/src/artifact/adapter/filesystem-compliance-state-reader.ts

import type { FileSystemAsyncPort, PathService } from '@arch/contracts';
import type { ComplianceState, ComplianceStateReader } from '@arch/platform-model';

export class FilesystemComplianceStateReader implements ComplianceStateReader {
  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}

  async read(workspaceRoot: string): Promise<ComplianceState> {
    const path = this.pathService.join(workspaceRoot, '.arch', 'compliance.json');

    if (!(await this.filesystem.exists(path))) {
      return {
        schemaVersion: 1,
        artifacts: {},
      };
    }

    return this.filesystem.readJson<ComplianceState>(path);
  }
}
