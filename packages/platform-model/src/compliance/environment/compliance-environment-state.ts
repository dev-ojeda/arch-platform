// packages/platform-model/src/compliance/environment/compliance-environment-state.ts

import type { ComplianceArtifactEnvironmentState } from './compliance-artifact-environment-state.js';
import type { ComplianceEnvironment } from './compliance-environment.js';

export interface ComplianceEnvironmentState {
  readonly name: ComplianceEnvironment;
  readonly order: number;
  readonly artifacts: Readonly<Record<string, ComplianceArtifactEnvironmentState>>;
  readonly schemaVersion: number;
}
