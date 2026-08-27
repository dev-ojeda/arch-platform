// packages/platform-model/src/compliance/compliance-state-change.ts

import type { ArtifactComplianceStatus } from './compliance-status.js';

export interface ComplianceStateChange {
  readonly artifact: string;
  readonly previous: ArtifactComplianceStatus | undefined;
  readonly current: ArtifactComplianceStatus;
}
