// packages/platform-model/src/compliance/compliance-state.ts

import type { HashResult } from '../hashing/hash-result.js';

import type { ArtifactComplianceStatus } from './compliance-status.js';

export interface ComplianceState {
  readonly schemaVersion: number;

  readonly artifacts: Readonly<
    Record<
      string,
      {
        readonly status: ArtifactComplianceStatus;
        readonly hash: HashResult;
      }
    >
  >;
}
