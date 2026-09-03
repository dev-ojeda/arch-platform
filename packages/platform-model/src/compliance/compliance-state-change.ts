// packages/platform-model/src/compliance/compliance-state-change.ts

import type { HashResult } from '../hashing/hash-result.js';

import type { ArtifactComplianceStatus } from './compliance-status.js';
import type { ComplianceEnvironment } from './environment/compliance-environment.js';

export interface ComplianceStateChange {
  readonly environment: ComplianceEnvironment;
  readonly artifact: string;

  readonly previousStatus: ArtifactComplianceStatus | undefined;
  readonly nextStatus: ArtifactComplianceStatus;

  readonly evaluatedHash: HashResult;
}
