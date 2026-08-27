// packages/platform-model/src/ports/compliance-state-reader.ts

import type { ComplianceState } from '../compliance/compliance-state.js';

export interface ComplianceStateReader {
  read(workspaceRoot: string): Promise<ComplianceState>;
}
