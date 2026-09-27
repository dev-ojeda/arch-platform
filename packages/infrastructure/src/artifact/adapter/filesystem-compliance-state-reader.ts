// packages/infrastructure/src/artifact/adapter/filesystem-compliance-state-reader.ts

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type {
  ComplianceEnvironment,
  ComplianceState,
  ComplianceStateReader,
} from '@arch-platform/platform-model';

export class FilesystemComplianceStateReader implements ComplianceStateReader {
  constructor(private readonly filesystem: FileSystemAsyncPort) {}

  async read(environment: ComplianceEnvironment): Promise<ComplianceState> {
    const path = `/.arch-platform/compliance/${environment}.json`;
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
