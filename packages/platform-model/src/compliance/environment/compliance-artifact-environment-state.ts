// packages\platform-model\src\compliance\environment\compliance-artifact-environment-state.ts

import type { HashResult } from '../../hashing/hash-result.js';
import type { ArtifactComplianceStatus } from '../compliance-status.js';

export interface ComplianceArtifactEnvironmentState {
  readonly status: ArtifactComplianceStatus;
  readonly evaluatedHash: HashResult;
  readonly approvedHash?: HashResult;
  readonly order: number;
  readonly evaluatedAt: number;
  readonly approvedAt?: number;
  readonly schemaVersion: number;
}
