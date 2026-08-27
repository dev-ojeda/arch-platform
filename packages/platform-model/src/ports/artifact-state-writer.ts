// packages/platform-model/src/ports/artifact-state-writer.ts

import type { ArtifactState } from '../artifact/artifact-state.js';

export interface ArtifactStateWriter {
  write(root: string, artifacts: ReadonlyMap<string, ArtifactState>): Promise<void>;
}
