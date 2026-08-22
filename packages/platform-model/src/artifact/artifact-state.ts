// packages/platform-model/src/artifact/artifact-state.ts

import type { HashResult } from '../hashing/hash-result.js';

export interface ArtifactState {
  readonly hash: HashResult;

  readonly dependencies: readonly string[];

  readonly status: ArtifactStateStatus;

  readonly startedAt: number;
  readonly finishedAt: number;

  readonly schemaVersion: number;
}

export type ArtifactStateStatus = 'built' | 'restored' | 'cached';
