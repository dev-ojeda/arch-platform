// packages/platform-model/src/compliance/compliance-state.ts

import type { ComplianceEnvironmentState } from './environment/compliance-environment-state.js';

export interface ComplianceState {
  readonly schemaVersion: number;

  readonly environment: ComplianceEnvironmentState;
}
