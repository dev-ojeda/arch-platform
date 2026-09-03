// packages/infrastructure/src/artifact/adapter/filesystem-compliance-state-writer.ts

import type { FileSystemAsyncPort, PathService } from '@arch/contracts';
import type {
  ComplianceEnvironment,
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
    private readonly environment: ComplianceEnvironment,
  ) {}

  apply(change: ComplianceStateChange): void {
    if (change.environment !== this.environment) {
      throw new Error(
        `Invalid compliance environment for "${change.artifact}": ` +
          `expected "${this.environment}", received "${change.environment}".`,
      );
    }

    const previousState = this.state.environment.artifacts[change.artifact];

    const previousStatus = previousState?.status;

    if (previousStatus !== change.previousStatus) {
      throw new Error(
        `Invalid compliance state transition for "${change.artifact}": ` +
          `expected previous state "${previousStatus}", received "${change.previousStatus}".`,
      );
    }

    const evaluatedAt = Date.now();

    const artifactState = {
      status: change.nextStatus,

      evaluatedHash: change.evaluatedHash,

      order: this.state.environment.order,

      evaluatedAt,

      schemaVersion: 1,

      ...(change.nextStatus === 'approved'
        ? {
            approvedHash: { ...change.evaluatedHash },
            approvedAt: evaluatedAt,
          }
        : previousState?.approvedHash
          ? {
              approvedHash: previousState.approvedHash,
              ...(previousState.approvedAt !== undefined
                ? {
                    approvedAt: previousState.approvedAt,
                  }
                : {}),
            }
          : {}),
    };

    this.state = {
      ...this.state,

      environment: {
        ...this.state.environment,

        artifacts: {
          ...this.state.environment.artifacts,

          [change.artifact]: artifactState,
        },
      },
    };

    this.changes.add(change);
  }
  getChanges(): ComplianceStateChanges {
    return this.changes.toSnapshot();
  }

  async write(): Promise<void> {
    const directory = this.pathService.join(this.workspaceRoot, '.arch', 'compliance');

    const path = this.pathService.join(directory, `${this.environment}.json`);

    await this.filesystem.createDirectory(directory);

    await this.filesystem.writeJson(path, this.state);
  }
}
