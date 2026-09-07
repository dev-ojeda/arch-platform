// packages/compliance/src/security/security-finding.ts
import { AdvisoryIdentifier } from '../advisories/advisory-identifier.js';

import type { SecuritySeverity } from './security-severity.js';

export interface SecurityFinding {
  readonly id: string;

  readonly advisory?: AdvisoryIdentifier;

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
