// packages/platform-model/src/security/security-state.ts

import type { SecurityArtifactState } from './security-artifact-state.js';

export interface SecurityState {
  readonly schemaVersion: number;
  readonly artifacts: Readonly<Record<string, SecurityArtifactState>>;
}
