// packages/platform-model/src/ports/artifact-output-fingerprint-port.ts

import type { OutputFingerprint } from '../artifact/artifact-manifest.js';

export interface ArtifactOutputFingerprinterPort {
  fingerprint(root: string, outputs: readonly string[]): Promise<OutputFingerprint[]>;
}
