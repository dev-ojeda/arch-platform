// packages/platform-model/src/compliance/compliance-state-change.ts

import type { HashResult } from '../hashing/hash-result.js';

import type { ArtifactComplianceStatus } from './compliance-status.js';

export interface ComplianceStateChange {
  readonly artifact: string;
  readonly previous: ArtifactComplianceStatus | undefined;
  readonly current: ArtifactComplianceStatus;
  readonly hash: HashResult;
}
