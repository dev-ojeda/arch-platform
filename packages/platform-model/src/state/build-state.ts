// packages/platform-model/src/state/build-state.ts

import type { HashResult } from '../hashing/hash-result.js';

export interface BuildStateEntry {
  readonly schemaVersion: number;
  readonly hash: HashResult;
  readonly outputs: readonly string[];
  readonly timestamp: number;
}

export type BuildState = Map<string, BuildStateEntry>;
