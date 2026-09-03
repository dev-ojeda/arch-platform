// packages/platform-model/src/ports/compliance-state-reader.ts

import type { ComplianceState } from '../compliance/compliance-state.js';
import type { ComplianceEnvironment } from '../compliance/environment/compliance-environment.js';

export interface ComplianceStateReader {
  read(root: string, environment: ComplianceEnvironment): Promise<ComplianceState>;
}
