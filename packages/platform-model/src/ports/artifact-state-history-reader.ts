// packages/platform-model/src/ports/artifact-state-history-reader.ts

import type { ArtifactStateHistory } from '../artifact/artifact-state-history.js';

export interface ArtifactStateHistoryReader {
  read(root: string): Promise<ReadonlyMap<string, ArtifactStateHistory>>;
}
