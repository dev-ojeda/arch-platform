// packages/infrastructure/src/artifact/adapter/filesystem-compliance-state-reader.ts

import type { FileSystemAsyncPort, PathService } from '@arch-platform/contracts';
import type {
  ComplianceEnvironment,
  ComplianceState,
  ComplianceStateReader,
} from '@arch-platform/platform-model';

export class FilesystemComplianceStateReader implements ComplianceStateReader {
  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}

  async read(workspaceRoot: string, environment: ComplianceEnvironment): Promise<ComplianceState> {
    const path = this.pathService.join(
      workspaceRoot,
      '.arch-platform',
      'compliance',
      `${environment}.json`,
    );

    if (!(await this.filesystem.exists(path))) {
      return {
        schemaVersion: 1,
        environment: {
          name: environment,
          order: 0,
          artifacts: {},
          schemaVersion: 1,
        },
      };
    }

    return this.filesystem.readJson<ComplianceState>(path);
  }
}
