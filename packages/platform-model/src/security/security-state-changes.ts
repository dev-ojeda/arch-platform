// packages/platform-model/src/security/security-state-changes.ts

import type { SecurityStateChange } from './security-state-change.js';

export interface SecurityStateChanges {
  readonly changes: readonly SecurityStateChange[];
}
