// packages/platform-model/src/pack/pack-reader.ts

import type { PackedArtifactInspect } from './pack-artifact-inspect.js';

export interface PackedReader {
  read(packPath: string): Promise<readonly PackedArtifactInspect[]>;
}
