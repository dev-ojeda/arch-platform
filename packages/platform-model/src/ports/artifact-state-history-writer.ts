// packages/platform-model/src/ports/artifact-state-history-writer.ts

import type { ArtifactStateHistory } from '../artifact/artifact-state-history.js';

export interface ArtifactStateHistoryWriter {
  write(root: string, history: ReadonlyMap<string, ArtifactStateHistory>): Promise<void>;
}
