// packages/build-core/src/state/state-writer.ts

import type { FileSystemAsyncPort, PathService } from '@arch/contracts';
import type { DagNode, HashResult } from '@arch/platform-model';

import { HASH_SCHEMA_VERSION } from '../hash/hash-schema-version.js';
import { safeStringify } from '../serialization/safe-stringify.js';

import { StateChangeSet } from './state-change-set.js';
import { getBuildStatePath } from './state-paths.js';
import type { BuildState } from './state-types.js';

export class BuildStateWriter {
  private readonly changes = new StateChangeSet();

  constructor(
    private readonly state: BuildState,
    private readonly workspaceRoot: string,
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}
  async write(): Promise<void> {
    const statePath = getBuildStatePath(this.workspaceRoot, this.pathService);

    await this.filesystem.createDirectory(this.pathService.dirname(statePath));

    await this.filesystem.write(statePath, safeStringify(this.state, 2));
  }
  commit(node: DagNode, hash: HashResult): void {
    const exists = this.state.has(node.name);

    this.state.set(node.name, {
      hash,
      outputs: [...node.outputs],
      timestamp: Date.now(),
      schemaVersion: HASH_SCHEMA_VERSION,
    });

    if (exists) {
      this.changes.updated.add(node.name);
    } else {
      this.changes.created.add(node.name);
    }
  }

  prune(activeNodes: Set<string>): void {
    for (const key of this.state.keys()) {
      if (!activeNodes.has(key)) {
        this.state.delete(key);

        this.changes.deleted.add(key);
      }
    }
  }

  getChanges(): StateChangeSet {
    return this.changes;
  }
}
