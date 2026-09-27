// packages/platform-model/src/ports/artifact-state-reader.ts

import type { ArtifactState } from '../artifact/artifact-state.js';

export interface ArtifactStateReader {
  read(): Promise<ReadonlyMap<string, ArtifactState>>;
}
