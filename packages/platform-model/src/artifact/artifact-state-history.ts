// packages/platform-model/src/artifact/artifact-state-history.ts

import type { ArtifactStateReason } from './artifact-state-reason.js';

export interface ArtifactStateHistory {
  readonly artifact: string;
  readonly changes: readonly ArtifactStateHistoryEntry[];
}

export interface ArtifactStateHistoryEntry {
  readonly previousHash: string | null;
  readonly currentHash: string;
  readonly reason: ArtifactStateReason;
  readonly timestamp: number;
}
