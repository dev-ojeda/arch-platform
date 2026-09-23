// packages/platform-model/src/ports/security-state-writer.ts

import type { SecurityStateChange } from '../security/security-state-change.js';
import type { SecurityStateChanges } from '../security/security-state-changes.js';

export interface SecurityStateWriter {
  apply(change: SecurityStateChange): void;

  getChanges(): SecurityStateChanges;

  write(): Promise<void>;
}
