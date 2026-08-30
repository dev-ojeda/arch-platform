// packages/platform-model/src/artifact/artifact-state.ts

import type { HashResult } from '../hashing/hash-result.js';

import type { ArtifactStateReason } from './artifact-state-reason.js';
import type { ArtifactType } from './artifact-type.js';

export interface ArtifactState {
  readonly hash: HashResult;
  readonly dependencies: readonly string[];
  readonly artifactType: ArtifactType;
  readonly status: ArtifactStateStatus;
  readonly reason: ArtifactStateReason;
  readonly startedAt: number;
  readonly finishedAt: number;
  readonly schemaVersion: number;
}

export type ArtifactStateStatus = 'built' | 'restored' | 'cached';
