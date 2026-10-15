// packages/infrastructure/src/artifact/adapter/filesystem-security-compliance-artifact-reader.ts

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type {
  ComplianceState,
  SecurityComplianceArtifact,
  SecurityComplianceArtifactReader,
  SecurityEnvironment,
} from '@arch-platform/platform-model';

export class FilesystemSecurityComplianceArtifactReader implements SecurityComplianceArtifactReader {
  constructor(private readonly filesystem: FileSystemAsyncPort) {}

  async read(
    packageName: string,
    environment: SecurityEnvironment,
  ): Promise<SecurityComplianceArtifact> {
    const path = `/.arch-platform/compliance/${environment}.json`;

    if (!(await this.filesystem.exists(path))) {
      throw new Error(`Security requires compliance state file "${path}".`);
    }

    const state = await this.filesystem.readJson<ComplianceState>(path);
    const artifact = state.environment.artifacts[packageName];

    if (!artifact) {
      throw new Error(
        `Compliance state not found for artifact "${packageName}" in environment "${environment}".`,
      );
    }

    return {
      status: artifact.status,
      hash: artifact.approvedHash?.hash ?? artifact.evaluatedHash.hash,
    };
  }
}
