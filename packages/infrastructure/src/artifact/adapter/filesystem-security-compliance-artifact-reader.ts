// packages/infrastructure/src/artifact/adapter/filesystem-security-compliance-artifact-reader.ts

import type { FileSystemAsyncPort, PathService } from '@arch-platform/contracts';
import type {
  ComplianceState,
  SecurityComplianceArtifact,
  SecurityComplianceArtifactReader,
} from '@arch-platform/platform-model';

export class FilesystemSecurityComplianceArtifactReader implements SecurityComplianceArtifactReader {
  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}

  async read(root: string, packageName: string): Promise<SecurityComplianceArtifact> {
    const path = this.pathService.join(root, '.arch-platform', 'compliance', 'dev.json');

    const state = await this.filesystem.readJson<ComplianceState>(path);
    const artifact = state.environment.artifacts[packageName];

    if (!artifact) {
      throw new Error(`Compliance state not found for artifact "${packageName}"`);
    }

    return {
      status: artifact.status,
      hash: artifact.approvedHash?.hash ?? artifact.evaluatedHash.hash,
    };
  }
}
