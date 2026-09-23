// packages/platform-model/src/security/security-finding.ts

import type { AdvisoryIdentifier } from './advisories/advisory-identifier.js';
import type { SecurityAdvisoryEvidence } from './security-advisory-evidence.js';
import type { SecuritySeverity } from './security-severity.js';

export interface SecurityFinding {
  readonly id: string;

  readonly advisory?: AdvisoryIdentifier;

  readonly evidence?: SecurityAdvisoryEvidence;

  readonly severity: SecuritySeverity;

  readonly category:
    | 'vulnerability'
    | 'secret'
    | 'license'
    | 'configuration'
    | 'integrity'
    | 'other';

  readonly message: string;

  readonly blocking: boolean;
}
