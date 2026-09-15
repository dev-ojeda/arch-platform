// packages/compliance/src/ports/security-advisory-affected-port.ts

import type { SecurityAdvisoryAffectedRecord } from '../advisories/security-advisory-affected-record.js';
import type { SecurityAdvisoryAffected } from '../advisories/security-advisory-affected.js';

export interface SecurityAdvisoryAffectedPort {
  advisoryAffected(root: SecurityAdvisoryAffectedRecord): SecurityAdvisoryAffected;
}
