// packages/platform-model/src/ports/state-writer.ts

import type { DagNode } from '../graph/dag-types.js';
import type { HashResult } from '../hashing/hash-result.js';
import type { StateChanges } from '../state/state-changes.js';

export interface StateWriter {
  write(): Promise<void>;

  commit(node: DagNode, hash: HashResult): void;

  prune(activeNodes: Set<string>): void;

  getChanges(): StateChanges;
}
