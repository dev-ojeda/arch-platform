// packages/platform-model/src/ports/security-state-reader.ts

import type { SecurityState } from '../security/security-state.js';

export interface SecurityStateReader {
  read(): Promise<SecurityState>;
}
