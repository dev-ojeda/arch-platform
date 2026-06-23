// packages/build-core/src/state/state-writer.ts

import type { DagNode } from '../graph/dag-types.js';
import type { HashResult } from '../hash/hash-result.js';
import { HASH_SCHEMA_VERSION } from '../hash/hash-version.js';

import { StateChangeSet } from './state-change-set.js';
import { persistBuildState } from './state-paths.js';
import type { BuildState } from './state-types.js';

export class BuildStateWriter {
  private readonly changes = new StateChangeSet();

  constructor(
    private readonly state: BuildState,
    private readonly workspaceRoot: string,
  ) {}

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

  async persist(): Promise<void> {
    await persistBuildState(this.workspaceRoot, this.state);
  }
}
