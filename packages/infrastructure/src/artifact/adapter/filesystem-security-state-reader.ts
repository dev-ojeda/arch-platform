// packages/infrastructure/src/artifact/adapter/filesystem-security-state-reader.ts

import type { FileSystemAsyncPort, PathService } from '@arch-platform/contracts';
import type {
  ComplianceArtifactEnvironmentState,
  ComplianceState,
  SecurityState,
  SecurityStateReader,
} from '@arch-platform/platform-model';

interface ComplianceEnvArtifact {
  readonly artifacts: Readonly<Record<string, ComplianceArtifactEnvironmentState>>;
}

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

  private async readComplianceEnvArtifact(root: string): Promise<ComplianceEnvArtifact> {
    const path = this.pathService.join(root, '.arch-platform', 'compliance', `dev.json`);
    const complianceState = await this.filesystem.readJson<ComplianceState>(path);

    return {
      artifacts: complianceState.environment.artifacts,
    };
  }
}
