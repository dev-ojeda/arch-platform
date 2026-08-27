// packages/platform-model/src/ports/artifact-state-reader.ts

import type { ArtifactState } from '../artifact/artifact-state.js';

export interface ArtifactStateReader {
  read(root: string): Promise<ReadonlyMap<string, ArtifactState>>;
}
