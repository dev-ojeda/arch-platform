// packages/infrastructure/src/artifact/adapter/filesystem-security-state-writer.ts

import type {
  SecurityState,
  SecurityStateChange,
  SecurityStateChanges,
  SecurityStateWriter,
} from '@arch-platform/compliance';
import type { FileSystemAsyncPort, PathService } from '@arch-platform/contracts';

import { MutableSecurityStateChanges } from '../../security/security-state-changes.js';

export class FilesystemSecurityStateWriter implements SecurityStateWriter {
  private readonly changes = new MutableSecurityStateChanges();

  constructor(
    private state: SecurityState,
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
    private readonly workspaceRoot: string,
  ) {}

  apply(change: SecurityStateChange): void {
    const previousState = this.state.artifacts[change.artifact];

    const previousStatus = previousState?.decision.status;

    if (previousStatus !== change.previousStatus) {
      throw new Error(
        `Invalid security state transition for "${change.artifact}": ` +
          `expected previous state "${previousStatus}", received "${change.previousStatus}".`,
      );
    }

    const artifactState = {
      previousStatus: change.previousStatus,
      evaluation: change.evaluation,
      decision: change.decision,
    };

    this.state = {
      ...this.state,

      artifacts: {
        ...this.state.artifacts,

        [change.artifact]: artifactState,
      },
    };

    this.changes.add(change);
  }

  getChanges(): SecurityStateChanges {
    return this.changes.toSnapshot();
  }

  async write(): Promise<void> {
    const directory = this.pathService.join(this.workspaceRoot, '.arch-platform', 'security');

    const path = this.pathService.join(directory, 'security.json');

    await this.filesystem.createDirectory(directory);

    await this.filesystem.writeJson(path, this.state);
  }
}
