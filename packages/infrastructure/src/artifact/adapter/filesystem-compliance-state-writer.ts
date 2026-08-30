// packages/infrastructure/src/artifact/adapter/filesystem-compliance-state-writer.ts

import type { FileSystemAsyncPort, PathService } from '@arch/contracts';
import type {
  ComplianceState,
  ComplianceStateChange,
  ComplianceStateChanges,
  ComplianceStateWriter,
} from '@arch/platform-model';

import { MutableComplianceStateChanges } from '../../compliance/compliance-state-changes.js';

export class FilesystemComplianceStateWriter implements ComplianceStateWriter {
  private readonly changes = new MutableComplianceStateChanges();

  constructor(
    private state: ComplianceState,
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
    private readonly workspaceRoot: string,
  ) {}

  apply(change: ComplianceStateChange): void {
    const previous = this.state.artifacts[change.artifact]?.status;

    if (previous !== change.previous) {
      throw new Error(
        `Invalid compliance state transition for "${change.artifact}": ` +
          `expected previous state "${previous}", received "${change.previous}".`,
      );
    }

    this.state = {
      ...this.state,
      artifacts: {
        ...this.state.artifacts,
        [change.artifact]: {
          status: change.current,
          hash: change.hash,
        },
      },
    };

    this.changes.add(change);
  }

  getChanges(): ComplianceStateChanges {
    return this.changes.toSnapshot();
  }

  async write(): Promise<void> {
    const path = this.pathService.join(this.workspaceRoot, '.arch', 'compliance.json');

    await this.filesystem.createDirectory(this.pathService.dirname(path));

    await this.filesystem.writeJson(path, this.state);
  }
}
